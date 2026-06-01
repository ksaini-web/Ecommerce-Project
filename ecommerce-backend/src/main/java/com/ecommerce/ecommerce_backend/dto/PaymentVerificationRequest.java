package com.ecommerce.ecommerce_backend.dto;

import lombok.Data;

@Data
public class PaymentVerificationRequest {
    private Long internalOrderId;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;
}