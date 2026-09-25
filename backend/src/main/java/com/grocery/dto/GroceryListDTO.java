package com.grocery.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class GroceryListDTO {
    private Long id;
    private String name;
    private List<GroceryListItemDTO> items;
}
