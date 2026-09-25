package com.grocery.controller;

import com.grocery.dto.ApiResponse;
import com.grocery.dto.CouponDTO;
import com.grocery.dto.CouponValidateRequest;
import com.grocery.service.CouponService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    @PostMapping("/validate")
    public ResponseEntity<ApiResponse<CouponDTO>> validateCoupon(@Valid @RequestBody CouponValidateRequest request) {
        CouponDTO coupon = couponService.validateCoupon(request);
        return ResponseEntity.ok(ApiResponse.success("Coupon applied successfully", coupon));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CouponDTO>>> getAllActiveCoupons() {
        List<CouponDTO> coupons = couponService.getAllActiveCoupons();
        return ResponseEntity.ok(ApiResponse.success(coupons));
    }
}
