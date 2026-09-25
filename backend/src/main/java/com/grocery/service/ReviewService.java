package com.grocery.service;

import com.grocery.dto.ReviewDTO;
import com.grocery.dto.ReviewRequest;
import com.grocery.entity.*;
import com.grocery.exception.BadRequestException;
import com.grocery.exception.ResourceNotFoundException;
import com.grocery.repository.OrderRepository;
import com.grocery.repository.ProductRepository;
import com.grocery.repository.ReviewRepository;
import com.grocery.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public ReviewDTO addReview(Long userId, Long productId, ReviewRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + request.getOrderId()));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You can only review products from your own orders");
        }

        if (order.getStatus() != OrderStatus.DELIVERED) {
            throw new BadRequestException("Reviews can only be submitted after the order is delivered");
        }

        boolean productInOrder = order.getItems().stream()
                .anyMatch(item -> item.getProduct().getId().equals(product.getId()));
        if (!productInOrder) {
            throw new BadRequestException("This product was not part of order #" + order.getId());
        }

        if (reviewRepository.existsByUserAndProductAndOrder(user, product, order)) {
            throw new BadRequestException("You have already reviewed this product for order #" + order.getId());
        }

        Review review = Review.builder()
                .user(user)
                .product(product)
                .order(order)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        Review saved = reviewRepository.save(review);

        // Update product average rating
        List<Review> productReviews = reviewRepository.findByProductOrderByCreatedAtDesc(product);
        double avg = productReviews.stream().mapToInt(Review::getRating).average().orElse(4.5);
        product.setRating(BigDecimal.valueOf(avg).setScale(1, RoundingMode.HALF_UP));
        productRepository.save(product);

        return mapToDTO(saved);
    }

    public List<ReviewDTO> getProductReviews(Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ReviewDTO> getAllReviews() {
        return reviewRepository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private ReviewDTO mapToDTO(Review review) {
        return ReviewDTO.builder()
                .id(review.getId())
                .userId(review.getUser().getId())
                .userName(review.getUser().getName())
                .productId(review.getProduct().getId())
                .productName(review.getProduct().getName())
                .orderId(review.getOrder().getId())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
