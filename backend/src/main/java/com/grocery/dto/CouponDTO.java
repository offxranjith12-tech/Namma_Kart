package com.grocery.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CouponDTO {
    private Long id;

    @NotBlank(message = "Code is required")
    private String code;

    @NotBlank(message = "Discount type is required")
    private String discountType; // PERCENTAGE or FLAT

    @NotNull(message = "Discount value is required")
    private BigDecimal discountValue;

    private BigDecimal minimumOrderAmount;
    private BigDecimal maximumDiscount;
    private LocalDate expiryDate;
    private Boolean active;

    // For validation response
    private BigDecimal calculatedDiscount;
}
