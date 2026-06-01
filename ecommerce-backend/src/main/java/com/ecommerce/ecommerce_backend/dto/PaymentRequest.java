package com.ecommerce.ecommerce_backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class PaymentRequest {

    private List<PaymentItem> items;
}