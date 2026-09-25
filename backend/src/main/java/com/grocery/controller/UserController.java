package com.grocery.controller;

import com.grocery.dto.ApiResponse;
import com.grocery.dto.UserDTO;
import com.grocery.security.UserPrincipal;
import com.grocery.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final AuthService authService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDTO>> getCurrentUser(@AuthenticationPrincipal UserPrincipal principal) {
        UserDTO user = authService.getCurrentUserProfile(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserDTO>> updateCurrentUser(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody UserDTO userDTO) {
        UserDTO updated = authService.updateCurrentUserProfile(principal.getId(), userDTO);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }
}
