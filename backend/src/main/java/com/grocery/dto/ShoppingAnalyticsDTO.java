package com.grocery.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ShoppingAnalyticsDTO {
    private Double totalSpent;
    private Integer totalOrders;
    private Double averageOrderValue;
    private Double currentMonthSpent;
    private Double previousMonthSpent;
    private Double totalSaved; // Through discounts
    private List<ProductSummary> mostPurchasedProducts;
    private List<CategorySummary> mostPurchasedCategories;
    private List<MonthlySpending> monthlySpending;
    private List<RecentSpending> recentSpending;

    @Data
    @Builder
    public static class ProductSummary {
        private String productName;
        private Integer quantity;
        private Double totalSpent;
    }

    @Data
    @Builder
    public static class CategorySummary {
        private String categoryName;
        private Double totalSpent;
    }

    @Data
    @Builder
    public static class MonthlySpending {
        private String month;
        private Double amount;
    }

    @Data
    @Builder
    public static class RecentSpending {
        private String date;
        private Double amount;
    }
}
