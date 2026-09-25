package com.grocery.controller;

import com.grocery.dto.ApiResponse;
import com.grocery.dto.NotificationDTO;
import com.grocery.security.UserPrincipal;
import com.grocery.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationDTO>>> getUserNotifications(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<NotificationDTO> notifications = notificationService.getUserNotifications(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(notifications));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        notificationService.markAsRead(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Marked as read", null));
    }
}
