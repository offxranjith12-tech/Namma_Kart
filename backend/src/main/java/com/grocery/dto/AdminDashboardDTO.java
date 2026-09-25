package com.grocery.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardDTO {
    private Long totalUsers;
    private Long totalCustomers;
    private Long totalProducts;
    private Long totalOrders;
    private Long pendingOrders; // PLACED + CONFIRMED + PREPARING
    private Long completedOrders; // DELIVERED
    private Long cancelledOrders;
    private BigDecimal totalRevenue;
    private BigDecimal todayRevenue;
    private BigDecimal thisWeekRevenue;
    private BigDecimal thisMonthRevenue;
    private Long lowStockCount;
    private Long totalDeliveryPersons;
    private Long activeDeliveryPersons;
    private Long pendingDeliveries;
    private Long completedDeliveries;
    private List<OrderResponseDTO> recentOrders;
    private List<ProductDTO> lowStockProducts;
}
