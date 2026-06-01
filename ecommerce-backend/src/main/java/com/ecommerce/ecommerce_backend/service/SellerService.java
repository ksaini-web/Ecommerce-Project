package com.ecommerce.ecommerce_backend.service;

import com.ecommerce.ecommerce_backend.dto.SellerDashboardResponse;
import com.ecommerce.ecommerce_backend.entity.Seller;
import com.ecommerce.ecommerce_backend.repository.OrderRepository;
import com.ecommerce.ecommerce_backend.repository.ProductRepository;
import com.ecommerce.ecommerce_backend.repository.SellerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class SellerService {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final SellerRepository sellerRepository; // ADD THIS

    public SellerDashboardResponse getDashboard(String email) { // sellerId → email

        Seller seller = sellerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        Integer sellerId = seller.getId(); // email se sellerId nikalo

        Long totalProducts = (long) productRepository.findBySellerId(sellerId).size();
        Long totalOrders   = orderRepository.countBySellerId(sellerId);
        BigDecimal revenue = orderRepository.getTotalRevenue(sellerId);

        return SellerDashboardResponse.builder()
                .totalProducts(totalProducts)
                .totalOrders(totalOrders)
                .totalRevenue(revenue)
                .build();
    }
}