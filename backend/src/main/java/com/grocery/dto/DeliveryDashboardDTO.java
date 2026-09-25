package com.grocery.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryDashboardDTO {
    private DeliveryPersonDTO deliveryPerson;
    private Long todayTotalDeliveries;
    private Long pendingDeliveries;
    private Long outForDeliveryCount;
    private Long completedDeliveries;
    private List<OrderResponseDTO> assignedOrders;
}
