package com.grocery.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long id;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    private String categoryName;

    @NotBlank(message = "Product name is required")
    private String name;

    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;

    @NotNull(message = "Stock is required")
    @Min(value = 0, message = "Stock cannot be negative")
    private Integer stock;

    @NotBlank(message = "Unit is required")
    private String unit;

    private String imageUrl;
    private BigDecimal discount;
    private BigDecimal discountedPrice;
    private BigDecimal rating;
    private Boolean active;
    private Integer minQuantity;
    private Integer maxQuantity;
    private LocalDateTime createdAt;
    
    // Expiry feature fields
    private java.time.LocalDate manufacturingDate;
    private java.time.LocalDate expiryDate;
    private Long daysRemaining;
    private Boolean isNearExpiry;
    private Boolean isExpired;
    private BigDecimal expiryDiscountPercentage;
}
