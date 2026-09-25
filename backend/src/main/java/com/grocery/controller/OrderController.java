package com.grocery.controller;

import com.grocery.dto.ApiResponse;
import com.grocery.dto.OrderCreateRequest;
import com.grocery.dto.OrderResponseDTO;
import com.grocery.security.UserPrincipal;
import com.grocery.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponseDTO>> createOrder(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody OrderCreateRequest request) {
        OrderResponseDTO order = orderService.createOrder(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Order placed successfully", order));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponseDTO>>> getUserOrders(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<OrderResponseDTO> orders = orderService.getUserOrders(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> getOrderById(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        OrderResponseDTO order = orderService.getOrderById(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.success(order));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> cancelOrder(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        OrderResponseDTO order = orderService.cancelOrder(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Order cancelled successfully", order));
    }

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<com.grocery.dto.ShoppingAnalyticsDTO>> getShoppingAnalytics(
            @AuthenticationPrincipal UserPrincipal principal) {
        com.grocery.dto.ShoppingAnalyticsDTO analytics = orderService.getShoppingAnalytics(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(analytics));
    }

    @GetMapping("/buy-again")
    public ResponseEntity<ApiResponse<List<com.grocery.dto.ProductDTO>>> getBuyAgain(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<com.grocery.dto.ProductDTO> products = orderService.getBuyAgain(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(products));
    }
}
