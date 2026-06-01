package com.ecommerce.ecommerce_backend.repository;

import com.ecommerce.ecommerce_backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserId(Integer userId);

    List<Order> findBySellerId(Integer sellerId);

    Long countBySellerId(Integer sellerId);

    @Query("""
        SELECT COALESCE(SUM(o.totalPrice),0)
        FROM Order o
        WHERE o.seller.id = :sellerId
        AND o.paymentStatus = 'SUCCESS'
    """)
    BigDecimal getTotalRevenue(Integer sellerId);

    Long countBySellerIdAndPaymentStatus(Integer sellerId, String paymentStatus);
}
