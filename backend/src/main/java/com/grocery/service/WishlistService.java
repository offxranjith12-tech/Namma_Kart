package com.grocery.service;

import com.grocery.dto.ProductDTO;
import com.grocery.entity.Product;
import com.grocery.entity.User;
import com.grocery.entity.Wishlist;
import com.grocery.exception.BadRequestException;
import com.grocery.exception.ResourceNotFoundException;
import com.grocery.repository.ProductRepository;
import com.grocery.repository.UserRepository;
import com.grocery.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ProductService productService;

    public List<ProductDTO> getUserWishlist(Long userId) {
        User user = getUser(userId);
        return wishlistRepository.findByUser(user).stream()
                .map(w -> productService.mapToDTO(w.getProduct()))
                .collect(Collectors.toList());
    }

    @Transactional
    public void addToWishlist(Long userId, Long productId) {
        User user = getUser(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        if (wishlistRepository.existsByUserAndProduct(user, product)) {
            return; // Already in wishlist
        }

        Wishlist wishlist = Wishlist.builder()
                .user(user)
                .product(product)
                .build();
        wishlistRepository.save(wishlist);
    }

    @Transactional
    public void removeFromWishlist(Long userId, Long productId) {
        User user = getUser(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        wishlistRepository.deleteByUserAndProduct(user, product);
    }

    public boolean isProductInWishlist(Long userId, Long productId) {
        User user = getUser(userId);
        Product product = productRepository.findById(productId).orElse(null);
        if (product == null) return false;
        return wishlistRepository.existsByUserAndProduct(user, product);
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }
}
