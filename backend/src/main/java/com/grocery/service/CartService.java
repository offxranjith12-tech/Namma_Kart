package com.grocery.service;

import com.grocery.dto.CartDTO;
import com.grocery.dto.CartItemDTO;
import com.grocery.dto.CartItemRequest;
import com.grocery.entity.Cart;
import com.grocery.entity.CartItem;
import com.grocery.entity.Product;
import com.grocery.entity.User;
import com.grocery.exception.BadRequestException;
import com.grocery.exception.ResourceNotFoundException;
import com.grocery.repository.CartItemRepository;
import com.grocery.repository.CartRepository;
import com.grocery.repository.ProductRepository;
import com.grocery.repository.UserRepository;
import com.grocery.repository.ExpiryRuleRepository;
import com.grocery.entity.ExpiryRule;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ExpiryRuleRepository expiryRuleRepository;

    @Transactional
    public CartDTO getUserCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        return mapCartToDTO(cart);
    }

    @Transactional
    public CartDTO addItemToCart(Long userId, CartItemRequest request) {
        Cart cart = getOrCreateCart(userId);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        if (!product.getActive()) {
            throw new BadRequestException("Product is currently unavailable");
        }

        if (product.getExpiryDate() != null) {
            long daysRemaining = java.time.temporal.ChronoUnit.DAYS.between(java.time.LocalDate.now(), product.getExpiryDate());
            if (daysRemaining < 0) {
                throw new BadRequestException("This product has expired and cannot be added to cart.");
            }
        }

        if (product.getStock() < request.getQuantity()) {
            throw new BadRequestException("Only " + product.getStock() + " units available in stock");
        }

        CartItem existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            int newQuantity = existingItem.getQuantity() + request.getQuantity();
            if (product.getStock() < newQuantity) {
                throw new BadRequestException("Cannot add more. Stock limit reached (" + product.getStock() + " available)");
            }
            existingItem.setQuantity(newQuantity);
            cartItemRepository.save(existingItem);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();
            cart.getItems().add(newItem);
            cartItemRepository.save(newItem);
        }

        return mapCartToDTO(cart);
    }

    @Transactional
    public CartDTO updateCartItemQuantity(Long userId, Long productId, Integer quantity) {
        Cart cart = getOrCreateCart(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        if (quantity <= 0) {
            return removeCartItem(userId, productId);
        }

        if (product.getStock() < quantity) {
            throw new BadRequestException("Only " + product.getStock() + " units available in stock");
        }

        CartItem item = cart.getItems().stream()
                .filter(ci -> ci.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Product not in cart"));

        item.setQuantity(quantity);
        cartItemRepository.save(item);

        return mapCartToDTO(cart);
    }

    @Transactional
    public CartDTO removeCartItem(Long userId, Long productId) {
        Cart cart = getOrCreateCart(userId);
        CartItem item = cart.getItems().stream()
                .filter(ci -> ci.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Product not in cart"));

        cart.getItems().remove(item);
        cartItemRepository.delete(item);

        return mapCartToDTO(cart);
    }

    @Transactional
    public void clearCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    public Cart getOrCreateCart(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        return cartRepository.findByUser(user)
                .orElseGet(() -> cartRepository.save(Cart.builder().user(user).items(new ArrayList<>()).build()));
    }

    public CartDTO mapCartToDTO(Cart cart) {
        List<CartItemDTO> itemDTOs = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal totalSavings = BigDecimal.ZERO;
        int totalItems = 0;

        for (CartItem item : cart.getItems()) {
            Product product = item.getProduct();
            BigDecimal originalPrice = product.getPrice();
            BigDecimal discount = product.getDiscount() != null ? product.getDiscount() : BigDecimal.ZERO;
            BigDecimal effectivePrice = originalPrice;
            
            Long daysRemaining = null;
            Boolean isNearExpiry = false;

            if (product.getExpiryDate() != null) {
                java.time.LocalDate today = java.time.LocalDate.now();
                daysRemaining = java.time.temporal.ChronoUnit.DAYS.between(today, product.getExpiryDate());
                
                if (daysRemaining < 0) {
                    // Item expired in cart
                    effectivePrice = BigDecimal.ZERO; 
                } else {
                    List<ExpiryRule> rules = expiryRuleRepository.findByActiveTrue();
                    for (ExpiryRule rule : rules) {
                        if (daysRemaining >= rule.getMinDays() && daysRemaining <= rule.getMaxDays()) {
                            isNearExpiry = true;
                            discount = rule.getDiscountPercentage();
                            break;
                        }
                    }
                }
            }

            if (discount.compareTo(BigDecimal.ZERO) > 0 && !(daysRemaining != null && daysRemaining < 0)) {
                BigDecimal multiplier = BigDecimal.ONE.subtract(discount.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP));
                effectivePrice = originalPrice.multiply(multiplier).setScale(2, RoundingMode.HALF_UP);
            }

            BigDecimal itemTotal = effectivePrice.multiply(BigDecimal.valueOf(item.getQuantity())).setScale(2, RoundingMode.HALF_UP);
            BigDecimal itemOriginalTotal = originalPrice.multiply(BigDecimal.valueOf(item.getQuantity())).setScale(2, RoundingMode.HALF_UP);
            BigDecimal itemSavings = itemOriginalTotal.subtract(itemTotal);

            subtotal = subtotal.add(itemTotal);
            totalSavings = totalSavings.add(itemSavings);
            totalItems += item.getQuantity();

            itemDTOs.add(CartItemDTO.builder()
                    .id(item.getId())
                    .productId(product.getId())
                    .productName(product.getName())
                    .productUnit(product.getUnit())
                    .imageUrl(product.getImageUrl())
                    .price(originalPrice)
                    .discount(discount)
                    .effectivePrice(effectivePrice)
                    .quantity(item.getQuantity())
                    .stock(product.getStock())
                    .itemTotal(itemTotal)
                    .expiryDate(product.getExpiryDate())
                    .daysRemaining(daysRemaining)
                    .isNearExpiry(isNearExpiry)
                    .build());
        }

        // Delivery Charge: Free if subtotal >= 500, else 30
        BigDecimal deliveryCharge = BigDecimal.ZERO;
        if (subtotal.compareTo(BigDecimal.ZERO) > 0) {
            if (subtotal.compareTo(BigDecimal.valueOf(500)) < 0) {
                deliveryCharge = BigDecimal.valueOf(30);
            }
        }

        BigDecimal totalAmount = subtotal.add(deliveryCharge);

        return CartDTO.builder()
                .id(cart.getId())
                .items(itemDTOs)
                .totalItems(totalItems)
                .subtotal(subtotal.setScale(2, RoundingMode.HALF_UP))
                .savings(totalSavings.setScale(2, RoundingMode.HALF_UP))
                .deliveryCharge(deliveryCharge.setScale(2, RoundingMode.HALF_UP))
                .totalAmount(totalAmount.setScale(2, RoundingMode.HALF_UP))
                .build();
    }
}
