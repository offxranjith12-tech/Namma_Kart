package com.grocery.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliverySlotDTO {
    private Long id;

    @NotBlank(message = "Slot name is required")
    private String slotName;

    @NotBlank(message = "Start time is required")
    private String startTime;

    @NotBlank(message = "End time is required")
    private String endTime;

    private Integer maximumOrders;
    private Boolean available;
    private Boolean active;
}
