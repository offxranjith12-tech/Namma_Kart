package com.grocery.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GroceryListRequestDTO {
    @NotBlank(message = "List name is required")
    private String name;
}
