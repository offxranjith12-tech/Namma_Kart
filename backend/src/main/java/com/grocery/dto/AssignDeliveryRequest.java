package com.grocery.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AssignDeliveryRequest {
    @NotNull(message = "Delivery person ID is required")
    private Long deliveryPersonId;
}
