package com.grocery.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDTO {
    private Long id;
    private Long productId;
    private String productName;
    private String productUnit;
    private String imageUrl;
    private BigDecimal price;
    private BigDecimal discount;
    private BigDecimal effectivePrice;
    private Integer quantity;
    private Integer stock;
    private BigDecimal itemTotal;
    
    private java.time.LocalDate expiryDate;
    private Long daysRemaining;
    private Boolean isNearExpiry;
}
