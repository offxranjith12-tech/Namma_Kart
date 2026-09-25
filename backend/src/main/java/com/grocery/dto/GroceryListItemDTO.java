package com.grocery.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class GroceryListItemDTO {
    private Long id;
    private Long productId;
    private String productName;
    private String imageUrl;
    private BigDecimal price;
    private BigDecimal discountedPrice;
    private Integer quantity;
}
