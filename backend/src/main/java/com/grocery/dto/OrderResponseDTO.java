package com.grocery.dto;

import com.grocery.entity.OrderStatus;
import com.grocery.entity.PaymentMethod;
import com.grocery.entity.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponseDTO {
    private Long id;
    private Long userId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    
    // Address
    private Long addressId;
    private String addressLine;
    private String city;
    private String state;
    private String pincode;

    // Delivery Slot
    private Long deliverySlotId;
    private String slotName;
    private String slotTime;

    // Coupon
    private String couponCode;
    private BigDecimal couponDiscount;

    // Delivery Person
    private Long deliveryPersonId;
    private String deliveryPersonName;
    private String deliveryPersonPhone;
    private String deliveryPersonVehicle;

    // Financials
    private BigDecimal subtotal;
    private BigDecimal deliveryCharge;
    private BigDecimal discount;
    private BigDecimal totalAmount;

    // Status & Payment
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private OrderStatus status;
    private String notes;

    // Timestamps
    private LocalDateTime assignedAt;
    private LocalDateTime pickedUpAt;
    private LocalDateTime deliveredAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Items
    private List<OrderItemDTO> items;
}
