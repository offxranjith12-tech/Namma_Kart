package com.grocery.controller;

import com.grocery.dto.*;
import com.grocery.security.UserPrincipal;
import com.grocery.service.DeliveryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/delivery")
@RequiredArgsConstructor
public class DeliveryController {

    private final DeliveryService deliveryService;

    @GetMapping(value = {"", "/dashboard"})
    public ResponseEntity<ApiResponse<DeliveryDashboardDTO>> getDeliveryDashboard(
            @AuthenticationPrincipal UserPrincipal principal) {
        DeliveryDashboardDTO dashboard = deliveryService.getDeliveryDashboard(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(dashboard));
    }

    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<List<OrderResponseDTO>>> getAssignedOrders(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<OrderResponseDTO> orders = deliveryService.getAssignedOrders(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> getAssignedOrderById(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        OrderResponseDTO order = deliveryService.getOrderById(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.success(order));
    }

    @PutMapping("/orders/{id}/accept")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> acceptDelivery(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        OrderResponseDTO order = deliveryService.acceptDelivery(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Delivery accepted successfully", order));
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> updateDeliveryStatus(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody OrderStatusUpdateRequest request) {
        OrderResponseDTO order = deliveryService.updateDeliveryStatus(principal.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Delivery status updated to " + request.getStatus(), order));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<OrderResponseDTO>>> getDeliveryHistory(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false, defaultValue = "all") String period) {
        List<OrderResponseDTO> history = deliveryService.getDeliveryHistory(principal.getId(), period);
        return ResponseEntity.ok(ApiResponse.success(history));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<DeliveryPersonDTO>> getDeliveryProfile(
            @AuthenticationPrincipal UserPrincipal principal) {
        DeliveryPersonDTO profile = deliveryService.getDeliveryProfile(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<DeliveryPersonDTO>> updateDeliveryProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody DeliveryPersonDTO dto) {
        DeliveryPersonDTO updated = deliveryService.updateDeliveryProfile(principal.getId(), dto);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }
}
