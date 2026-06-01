package com.ecommerce.ecommerce_backend.controller;

import com.ecommerce.ecommerce_backend.config.JwtService;
import com.ecommerce.ecommerce_backend.entity.Order;
import com.ecommerce.ecommerce_backend.entity.User;
import com.ecommerce.ecommerce_backend.repository.UserRepository;
import com.ecommerce.ecommerce_backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<List<Order>> getMyOrders(
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtService.extractEmail(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Order> orders = orderService.getUserOrders(user.getId());
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getUserOrders(
            @PathVariable Integer userId
    ) {
        return ResponseEntity.ok(orderService.getUserOrders(userId));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(
            @PathVariable Long orderId
    ) {
        return ResponseEntity.ok(orderService.getOrderById(orderId));
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<Order>> getSellerOrders(
            @PathVariable Integer sellerId
    ) {
        return ResponseEntity.ok(orderService.getSellerOrders(sellerId));
    }
}
