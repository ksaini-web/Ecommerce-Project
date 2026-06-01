package com.ecommerce.ecommerce_backend.controller;

import com.ecommerce.ecommerce_backend.dto.SellerDashboardResponse;
import com.ecommerce.ecommerce_backend.entity.Order;
import com.ecommerce.ecommerce_backend.entity.Seller;
import com.ecommerce.ecommerce_backend.repository.OrderRepository;
import com.ecommerce.ecommerce_backend.repository.ProductRepository;
import com.ecommerce.ecommerce_backend.repository.SellerRepository;
import com.ecommerce.ecommerce_backend.service.SellerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/seller")
@RequiredArgsConstructor
public class SellerController {

    private final SellerService sellerService;
    private final SellerRepository sellerRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<SellerDashboardResponse> getDashboard() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return ResponseEntity.ok(sellerService.getDashboard(email));
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        Seller seller = sellerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        Integer sellerId = seller.getId();
        List<Order> sellerOrders = orderRepository.findBySellerId(sellerId);

        Long totalOrders = (long) sellerOrders.size();
        BigDecimal totalRevenue = sellerOrders.stream()
                .map(Order::getTotalPrice)
                .filter(price -> price != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        Long totalProducts = (long) productRepository.findBySellerId(sellerId).size();
        Long successfulPayments = sellerOrders.stream()
                .filter(order -> "SUCCESS".equalsIgnoreCase(order.getPaymentStatus())
                        || "PAID".equalsIgnoreCase(order.getPaymentStatus()))
                .count();
        List<Order> recentOrders = sellerOrders.stream()
                .sorted(Comparator.comparing(Order::getCreatedAt,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(5)
                .toList();

        return ResponseEntity.ok(Map.of(
                "totalOrders", totalOrders,
                "totalRevenue", totalRevenue,
                "totalProducts", totalProducts,
                "successfulPayments", successfulPayments,
                "recentOrders", recentOrders
        ));
    }
}
