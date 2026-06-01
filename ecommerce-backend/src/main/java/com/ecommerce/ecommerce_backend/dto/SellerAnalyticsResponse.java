package com.ecommerce.ecommerce_backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SellerAnalyticsResponse {

    private Long totalUsers;

    private Long totalQuantity;

    private String mostAddedProduct;

    private Long mostAddedCount;

    private String oldestCartDate;
}
