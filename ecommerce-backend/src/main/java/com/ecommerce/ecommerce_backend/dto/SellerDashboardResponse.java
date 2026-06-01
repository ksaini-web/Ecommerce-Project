package com.ecommerce.ecommerce_backend.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class SellerDashboardResponse {

    private Long totalProducts;
    private Long totalOrders;
    private BigDecimal totalRevenue;
}