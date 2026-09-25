package com.grocery.controller;

import com.grocery.dto.ApiResponse;
import com.grocery.dto.DeliveryPersonCreateRequest;
import com.grocery.dto.DeliveryPersonDTO;
import com.grocery.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/delivery-persons")
@RequiredArgsConstructor
public class AdminDeliveryPersonController {

    private final AdminService adminService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<DeliveryPersonDTO>>> getAllDeliveryPersons() {
        List<DeliveryPersonDTO> list = adminService.getAllDeliveryPersons();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DeliveryPersonDTO>> getDeliveryPersonById(@PathVariable Long id) {
        DeliveryPersonDTO dp = adminService.getDeliveryPersonById(id);
        return ResponseEntity.ok(ApiResponse.success(dp));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DeliveryPersonDTO>> createDeliveryPerson(
            @Valid @RequestBody DeliveryPersonCreateRequest request) {
        DeliveryPersonDTO created = adminService.createDeliveryPerson(request);
        return ResponseEntity.ok(ApiResponse.success("Delivery person created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DeliveryPersonDTO>> updateDeliveryPerson(
            @PathVariable Long id,
            @Valid @RequestBody DeliveryPersonDTO dto) {
        DeliveryPersonDTO updated = adminService.updateDeliveryPerson(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Delivery person updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDeliveryPerson(@PathVariable Long id) {
        adminService.deleteDeliveryPerson(id);
        return ResponseEntity.ok(ApiResponse.success("Delivery person deactivated", null));
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<ApiResponse<DeliveryPersonDTO>> activateDeliveryPerson(@PathVariable Long id) {
        DeliveryPersonDTO updated = adminService.toggleDeliveryPersonStatus(id, true);
        return ResponseEntity.ok(ApiResponse.success("Delivery person activated", updated));
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<ApiResponse<DeliveryPersonDTO>> deactivateDeliveryPerson(@PathVariable Long id) {
        DeliveryPersonDTO updated = adminService.toggleDeliveryPersonStatus(id, false);
        return ResponseEntity.ok(ApiResponse.success("Delivery person deactivated", updated));
    }
}
