package com.grocery.dto;

import com.grocery.entity.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderCreateRequest {
    @NotNull(message = "Address ID is required")
    private Long addressId;

    @NotNull(message = "Delivery slot ID is required")
    private Long deliverySlotId;

    private String couponCode;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;

    private String notes;
}
