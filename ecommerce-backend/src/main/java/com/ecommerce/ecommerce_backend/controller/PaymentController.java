package com.ecommerce.ecommerce_backend.controller;

import com.ecommerce.ecommerce_backend.service.OrderService;  // ADD
import com.ecommerce.ecommerce_backend.dto.PaymentItem;
import com.ecommerce.ecommerce_backend.dto.PaymentRequest;
import com.ecommerce.ecommerce_backend.dto.PaymentVerificationRequest;
import com.ecommerce.ecommerce_backend.entity.Order;
import com.ecommerce.ecommerce_backend.entity.Product;
import com.ecommerce.ecommerce_backend.repository.ProductRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final RazorpayClient razorpayClient;
    private final ProductRepository productRepository;
    private final OrderService orderService;

    @Value("${razorpay.key.id}")
    private String razorpayKey;

    @PostMapping("/create-order")
    public ResponseEntity createOrder(
            @RequestBody PaymentRequest request,
            @RequestHeader("Authorization") String authHeader
    ) throws RazorpayException {

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (PaymentItem item : request.getItems()) {
            Product product = productRepository
                    .findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            totalAmount = totalAmount.add(
                    product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()))
            );
        }

        JSONObject options = new JSONObject();
        options.put("amount", totalAmount.multiply(BigDecimal.valueOf(100)));
        options.put("currency", "INR");
        options.put("receipt", "txn_" + System.currentTimeMillis());

        com.razorpay.Order razorpayOrder = razorpayClient.orders.create(options);

        Order dbOrder = orderService.createPendingOrder(
                request.getItems(),
                totalAmount,
                razorpayOrder.get("id").toString(),
                authHeader
        );

        Map response = new HashMap<>();
        response.put("razorpayOrderId", razorpayOrder.get("id"));
        response.put("internalOrderId", dbOrder.getId());
        response.put("amount", razorpayOrder.get("amount"));
        response.put("currency", razorpayOrder.get("currency"));
        response.put("key", razorpayKey);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify")
    public ResponseEntity verifyPayment(
            @RequestBody PaymentVerificationRequest request
    ) {
        boolean success = orderService.verifyAndUpdateOrder(
                request.getInternalOrderId(),
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(),
                request.getRazorpaySignature()
        );

        if (!success) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Payment verification failed"));
        }

        return ResponseEntity.ok(Map.of("message", "Payment Successful"));
    }
}