package com.grocery.service;

import com.grocery.dto.CouponDTO;
import com.grocery.dto.CouponValidateRequest;
import com.grocery.entity.Coupon;
import com.grocery.exception.BadRequestException;
import com.grocery.exception.ResourceNotFoundException;
import com.grocery.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;

    public CouponDTO validateCoupon(CouponValidateRequest request) {
        Coupon coupon = couponRepository.findByCodeIgnoreCaseAndActiveTrue(request.getCode().trim())
                .orElseThrow(() -> new BadRequestException("Invalid or inactive coupon code: " + request.getCode()));

        if (coupon.getExpiryDate() != null && coupon.getExpiryDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("Coupon code has expired");
        }

        if (coupon.getMinimumOrderAmount() != null && request.getOrderAmount().compareTo(coupon.getMinimumOrderAmount()) < 0) {
            throw new BadRequestException("Minimum order amount of ₹" + coupon.getMinimumOrderAmount() + " required to use this coupon");
        }

        BigDecimal calculatedDiscount = BigDecimal.ZERO;
        if ("PERCENTAGE".equalsIgnoreCase(coupon.getDiscountType())) {
            calculatedDiscount = request.getOrderAmount()
                    .multiply(coupon.getDiscountValue())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

            if (coupon.getMaximumDiscount() != null && calculatedDiscount.compareTo(coupon.getMaximumDiscount()) > 0) {
                calculatedDiscount = coupon.getMaximumDiscount();
            }
        } else if ("FLAT".equalsIgnoreCase(coupon.getDiscountType())) {
            calculatedDiscount = coupon.getDiscountValue();
        }

        if (calculatedDiscount.compareTo(request.getOrderAmount()) > 0) {
            calculatedDiscount = request.getOrderAmount();
        }

        CouponDTO dto = mapToDTO(coupon);
        dto.setCalculatedDiscount(calculatedDiscount);
        return dto;
    }

    public List<CouponDTO> getAllActiveCoupons() {
        return couponRepository.findAll().stream()
                .filter(c -> Boolean.TRUE.equals(c.getActive()))
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<CouponDTO> getAllCouponsAdmin() {
        return couponRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public CouponDTO createCoupon(CouponDTO dto) {
        if (couponRepository.findByCodeIgnoreCase(dto.getCode().trim()).isPresent()) {
            throw new BadRequestException("Coupon code already exists");
        }

        Coupon coupon = Coupon.builder()
                .code(dto.getCode().toUpperCase().trim())
                .discountType(dto.getDiscountType().toUpperCase())
                .discountValue(dto.getDiscountValue())
                .minimumOrderAmount(dto.getMinimumOrderAmount() != null ? dto.getMinimumOrderAmount() : BigDecimal.ZERO)
                .maximumDiscount(dto.getMaximumDiscount())
                .expiryDate(dto.getExpiryDate())
                .active(dto.getActive() != null ? dto.getActive() : true)
                .build();

        return mapToDTO(couponRepository.save(coupon));
    }

    @Transactional
    public CouponDTO updateCoupon(Long id, CouponDTO dto) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found with id: " + id));

        coupon.setCode(dto.getCode().toUpperCase().trim());
        coupon.setDiscountType(dto.getDiscountType().toUpperCase());
        coupon.setDiscountValue(dto.getDiscountValue());
        coupon.setMinimumOrderAmount(dto.getMinimumOrderAmount() != null ? dto.getMinimumOrderAmount() : BigDecimal.ZERO);
        coupon.setMaximumDiscount(dto.getMaximumDiscount());
        coupon.setExpiryDate(dto.getExpiryDate());
        if (dto.getActive() != null) coupon.setActive(dto.getActive());

        return mapToDTO(couponRepository.save(coupon));
    }

    @Transactional
    public void deleteCoupon(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found with id: " + id));
        coupon.setActive(false);
        couponRepository.save(coupon);
    }

    public CouponDTO mapToDTO(Coupon coupon) {
        return CouponDTO.builder()
                .id(coupon.getId())
                .code(coupon.getCode())
                .discountType(coupon.getDiscountType())
                .discountValue(coupon.getDiscountValue())
                .minimumOrderAmount(coupon.getMinimumOrderAmount())
                .maximumDiscount(coupon.getMaximumDiscount())
                .expiryDate(coupon.getExpiryDate())
                .active(coupon.getActive())
                .build();
    }
}
