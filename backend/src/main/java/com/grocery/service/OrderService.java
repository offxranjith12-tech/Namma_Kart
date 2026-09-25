package com.grocery.service;

import com.grocery.dto.*;
import com.grocery.entity.*;
import com.grocery.exception.BadRequestException;
import com.grocery.exception.ResourceNotFoundException;
import com.grocery.exception.UnauthorizedException;
import com.grocery.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final AddressRepository addressRepository;
    private final DeliverySlotRepository deliverySlotRepository;
    private final CouponRepository couponRepository;
    private final DeliveryPersonRepository deliveryPersonRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final CouponService couponService;

    @Transactional
    public OrderResponseDTO createOrder(Long userId, OrderCreateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new BadRequestException("Cart is empty"));

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new BadRequestException("Cannot place order with empty cart");
        }

        Address address = addressRepository.findByIdAndUser(request.getAddressId(), user)
                .orElseThrow(() -> new BadRequestException("Invalid delivery address selected"));

        DeliverySlot deliverySlot = deliverySlotRepository.findById(request.getDeliverySlotId())
                .orElseThrow(() -> new BadRequestException("Invalid delivery slot selected"));

        if (!Boolean.TRUE.equals(deliverySlot.getActive())) {
            throw new BadRequestException("Selected delivery slot is currently unavailable");
        }

        // Validate stock and calculate backend subtotal
        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal totalSavings = BigDecimal.ZERO;
        List<OrderItem> orderItemsToSave = new ArrayList<>();

        for (CartItem ci : cart.getItems()) {
            Product product = productRepository.findById(ci.getProduct().getId())
                    .orElseThrow(() -> new BadRequestException("Product not found: " + ci.getProduct().getName()));

            if (!Boolean.TRUE.equals(product.getActive())) {
                throw new BadRequestException("Product '" + product.getName() + "' is no longer available");
            }

            if (product.getStock() < ci.getQuantity()) {
                throw new BadRequestException("Insufficient stock for '" + product.getName() + "'. Available: " + product.getStock());
            }

            // Calculate effective price
            BigDecimal price = product.getPrice();
            BigDecimal discount = product.getDiscount() != null ? product.getDiscount() : BigDecimal.ZERO;
            BigDecimal effectivePrice = price;

            if (discount.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal multiplier = BigDecimal.ONE.subtract(discount.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP));
                effectivePrice = price.multiply(multiplier).setScale(2, RoundingMode.HALF_UP);
            }

            BigDecimal itemSubtotal = effectivePrice.multiply(BigDecimal.valueOf(ci.getQuantity())).setScale(2, RoundingMode.HALF_UP);
            BigDecimal originalSubtotal = price.multiply(BigDecimal.valueOf(ci.getQuantity())).setScale(2, RoundingMode.HALF_UP);

            subtotal = subtotal.add(itemSubtotal);
            totalSavings = totalSavings.add(originalSubtotal.subtract(itemSubtotal));

            // Reduce stock
            product.setStock(product.getStock() - ci.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = OrderItem.builder()
                    .product(product)
                    .productName(product.getName())
                    .quantity(ci.getQuantity())
                    .price(effectivePrice)
                    .subtotal(itemSubtotal)
                    .build();
            orderItemsToSave.add(orderItem);
        }

        // Delivery Charge calculation: if subtotal >= 500 => FREE (0), else 30
        BigDecimal deliveryCharge = subtotal.compareTo(BigDecimal.valueOf(500)) >= 0 ? BigDecimal.ZERO : BigDecimal.valueOf(30);

        // Coupon calculation
        Coupon coupon = null;
        BigDecimal couponDiscount = BigDecimal.ZERO;
        if (request.getCouponCode() != null && !request.getCouponCode().trim().isEmpty()) {
            CouponValidateRequest cvr = new CouponValidateRequest();
            cvr.setCode(request.getCouponCode().trim());
            cvr.setOrderAmount(subtotal);
            CouponDTO couponDTO = couponService.validateCoupon(cvr);
            couponDiscount = couponDTO.getCalculatedDiscount();
            coupon = couponRepository.findByCodeIgnoreCase(request.getCouponCode().trim()).orElse(null);
        }

        BigDecimal totalAmount = subtotal.add(deliveryCharge).subtract(couponDiscount);
        if (totalAmount.compareTo(BigDecimal.ZERO) < 0) {
            totalAmount = BigDecimal.ZERO;
        }

        // Determine Payment Status
        PaymentStatus paymentStatus = (request.getPaymentMethod() == PaymentMethod.COD)
                ? PaymentStatus.PENDING
                : PaymentStatus.PAID;

        Order order = Order.builder()
                .user(user)
                .address(address)
                .deliverySlot(deliverySlot)
                .coupon(coupon)
                .subtotal(subtotal)
                .deliveryCharge(deliveryCharge)
                .discount(totalSavings)
                .couponDiscount(couponDiscount)
                .totalAmount(totalAmount.setScale(2, RoundingMode.HALF_UP))
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus(paymentStatus)
                .status(OrderStatus.PLACED)
                .notes(request.getNotes())
                .items(new ArrayList<>())
                .build();

        Order savedOrder = orderRepository.save(order);

        for (OrderItem oi : orderItemsToSave) {
            oi.setOrder(savedOrder);
            orderItemRepository.save(oi);
            savedOrder.getItems().add(oi);
        }

        // Clear cart
        cart.getItems().clear();
        cartRepository.save(cart);

        // Create Customer notification
        notificationService.createNotification(user, savedOrder.getId(),
                "Your order #NK" + savedOrder.getId() + " has been placed successfully!");

        return mapToDTO(savedOrder);
    }

    public List<OrderResponseDTO> getUserOrders(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        return orderRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public OrderResponseDTO getOrderById(Long userId, Long orderId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (!order.getUser().getId().equals(user.getId()) && user.getRole() != Role.ROLE_ADMIN) {
            throw new UnauthorizedException("You are not authorized to view this order");
        }

        return mapToDTO(order);
    }

    @Transactional
    public OrderResponseDTO cancelOrder(Long userId, Long orderId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (!order.getUser().getId().equals(user.getId()) && user.getRole() != Role.ROLE_ADMIN) {
            throw new UnauthorizedException("You are not authorized to cancel this order");
        }

        if (order.getStatus() == OrderStatus.OUT_FOR_DELIVERY || order.getStatus() == OrderStatus.DELIVERED) {
            throw new BadRequestException("Cannot cancel an order that is already " + order.getStatus().name().toLowerCase().replace('_', ' '));
        }

        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new BadRequestException("Order is already cancelled");
        }

        order.setStatus(OrderStatus.CANCELLED);

        // Restore stock
        for (OrderItem item : order.getItems()) {
            Product p = item.getProduct();
            if (p != null) {
                p.setStock(p.getStock() + item.getQuantity());
                productRepository.save(p);
            }
        }

        Order saved = orderRepository.save(order);

        notificationService.createNotification(order.getUser(), saved.getId(),
                "Your order #NK" + saved.getId() + " has been cancelled.");

        return mapToDTO(saved);
    }

    public List<OrderResponseDTO> getAllOrdersAdmin(OrderStatus status) {
        List<Order> orders;
        if (status != null) {
            orders = orderRepository.findByStatusOrderByCreatedAtDesc(status);
        } else {
            orders = orderRepository.findAllByOrderByCreatedAtDesc();
        }
        return orders.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Transactional
    public OrderResponseDTO updateOrderStatusAdmin(Long orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        OrderStatus current = order.getStatus();

        // Validate transitions
        if (current == OrderStatus.DELIVERED || current == OrderStatus.CANCELLED) {
            throw new BadRequestException("Cannot change status of an order that is already " + current);
        }

        order.setStatus(newStatus);
        if (newStatus == OrderStatus.OUT_FOR_DELIVERY && order.getPickedUpAt() == null) {
            order.setPickedUpAt(LocalDateTime.now());
        } else if (newStatus == OrderStatus.DELIVERED) {
            order.setDeliveredAt(LocalDateTime.now());
            order.setPaymentStatus(PaymentStatus.PAID);
        }

        Order saved = orderRepository.save(order);

        // Notify customer
        String msg = switch (newStatus) {
            case CONFIRMED -> "Your order #NK" + saved.getId() + " has been confirmed!";
            case PREPARING -> "Your order #NK" + saved.getId() + " is being prepared.";
            case OUT_FOR_DELIVERY -> "Your order #NK" + saved.getId() + " is now out for delivery.";
            case DELIVERED -> "Your order #NK" + saved.getId() + " has been delivered. Enjoy your fresh groceries!";
            case CANCELLED -> "Your order #NK" + saved.getId() + " has been cancelled.";
            default -> "Your order #NK" + saved.getId() + " status updated to " + newStatus;
        };
        notificationService.createNotification(saved.getUser(), saved.getId(), msg);

        return mapToDTO(saved);
    }

    @Transactional
    public OrderResponseDTO assignDeliveryPersonAdmin(Long orderId, Long deliveryPersonId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (order.getStatus() == OrderStatus.CANCELLED || order.getStatus() == OrderStatus.DELIVERED) {
            throw new BadRequestException("Cannot assign delivery person for " + order.getStatus() + " order");
        }

        DeliveryPerson deliveryPerson = deliveryPersonRepository.findById(deliveryPersonId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery person not found with id: " + deliveryPersonId));

        if (!Boolean.TRUE.equals(deliveryPerson.getActive())) {
            throw new BadRequestException("Cannot assign an inactive delivery person");
        }

        order.setDeliveryPerson(deliveryPerson);
        order.setAssignedAt(LocalDateTime.now());

        if (order.getStatus() == OrderStatus.PLACED || order.getStatus() == OrderStatus.CONFIRMED) {
            order.setStatus(OrderStatus.PREPARING);
        }

        Order saved = orderRepository.save(order);

        // Notify Delivery Person
        notificationService.createNotification(deliveryPerson.getUser(), saved.getId(),
                "New delivery assigned: Order #NK" + saved.getId() + " to " + saved.getAddress().getCity());

        // Notify Customer
        notificationService.createNotification(saved.getUser(), saved.getId(),
                "Delivery agent " + deliveryPerson.getName() + " has been assigned to your order #NK" + saved.getId());

        return mapToDTO(saved);
    }

    public OrderResponseDTO mapToDTO(Order order) {
        List<OrderItemDTO> itemDTOs = order.getItems() != null ? order.getItems().stream()
                .map(item -> OrderItemDTO.builder()
                        .id(item.getId())
                        .productId(item.getProduct() != null ? item.getProduct().getId() : null)
                        .productName(item.getProductName())
                        .productUnit(item.getProduct() != null ? item.getProduct().getUnit() : "")
                        .imageUrl(item.getProduct() != null ? item.getProduct().getImageUrl() : "")
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .subtotal(item.getSubtotal())
                        .build())
                .collect(Collectors.toList()) : new ArrayList<>();

        DeliveryPerson dp = order.getDeliveryPerson();
        DeliverySlot slot = order.getDeliverySlot();
        Address addr = order.getAddress();
        User customer = order.getUser();

        return OrderResponseDTO.builder()
                .id(order.getId())
                .userId(customer != null ? customer.getId() : null)
                .customerName(customer != null ? customer.getName() : "")
                .customerEmail(customer != null ? customer.getEmail() : "")
                .customerPhone(customer != null ? customer.getPhone() : "")
                .addressId(addr != null ? addr.getId() : null)
                .addressLine(addr != null ? addr.getAddressLine() : "")
                .city(addr != null ? addr.getCity() : "")
                .state(addr != null ? addr.getState() : "")
                .pincode(addr != null ? addr.getPincode() : "")
                .deliverySlotId(slot != null ? slot.getId() : null)
                .slotName(slot != null ? slot.getSlotName() : "")
                .slotTime(slot != null ? slot.getStartTime() + " - " + slot.getEndTime() : "")
                .couponCode(order.getCoupon() != null ? order.getCoupon().getCode() : null)
                .couponDiscount(order.getCouponDiscount())
                .deliveryPersonId(dp != null ? dp.getId() : null)
                .deliveryPersonName(dp != null ? dp.getName() : null)
                .deliveryPersonPhone(dp != null ? dp.getPhone() : null)
                .deliveryPersonVehicle(dp != null ? (dp.getVehicleType() + " (" + dp.getVehicleNumber() + ")") : null)
                .subtotal(order.getSubtotal())
                .deliveryCharge(order.getDeliveryCharge())
                .discount(order.getDiscount())
                .totalAmount(order.getTotalAmount())
                .paymentMethod(order.getPaymentMethod())
                .paymentStatus(order.getPaymentStatus())
                .status(order.getStatus())
                .notes(order.getNotes())
                .assignedAt(order.getAssignedAt())
                .pickedUpAt(order.getPickedUpAt())
                .deliveredAt(order.getDeliveredAt())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .items(itemDTOs)
                .build();
    }
}
