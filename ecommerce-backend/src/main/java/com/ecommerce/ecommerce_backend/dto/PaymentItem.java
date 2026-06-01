package com.ecommerce.ecommerce_backend.dto;

import lombok.Data;

@Data
public class PaymentItem {

    private Long productId;
    private Integer quantity;
}