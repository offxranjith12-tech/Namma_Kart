package com.grocery.controller;

import com.grocery.dto.ApiResponse;
import com.grocery.dto.ReviewDTO;
import com.grocery.dto.ReviewRequest;
import com.grocery.security.UserPrincipal;
import com.grocery.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products/{productId}/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ApiResponse<ReviewDTO>> addReview(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long productId,
            @Valid @RequestBody ReviewRequest request) {
        ReviewDTO review = reviewService.addReview(principal.getId(), productId, request);
        return ResponseEntity.ok(ApiResponse.success("Review submitted successfully", review));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ReviewDTO>>> getProductReviews(@PathVariable Long productId) {
        List<ReviewDTO> reviews = reviewService.getProductReviews(productId);
        return ResponseEntity.ok(ApiResponse.success(reviews));
    }
}
