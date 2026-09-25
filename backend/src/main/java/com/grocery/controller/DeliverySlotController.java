package com.grocery.controller;

import com.grocery.dto.ApiResponse;
import com.grocery.dto.DeliverySlotDTO;
import com.grocery.service.DeliverySlotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/delivery-slots")
@RequiredArgsConstructor
public class DeliverySlotController {

    private final DeliverySlotService deliverySlotService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<DeliverySlotDTO>>> getAllSlots() {
        List<DeliverySlotDTO> slots = deliverySlotService.getAllActiveSlots();
        return ResponseEntity.ok(ApiResponse.success(slots));
    }
}
