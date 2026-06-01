package com.ecommerce.ecommerce_backend.repository;

import com.ecommerce.ecommerce_backend.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<CartItem, Integer> {

    List<CartItem> findByUserId(Integer userId);

    Optional<CartItem> findByUserIdAndProductId(
            Integer userId,
            Long productId
    );

    List<CartItem> findByProductSellerId(Integer sellerId);

    @Query("""
        SELECT COUNT(DISTINCT c.user.id)
        FROM CartItem c
        WHERE c.product.seller.id = :sellerId
    """)
    Long countDistinctUsersBySellerId(Integer sellerId);

    @Query("""
        SELECT SUM(c.quantity)
        FROM CartItem c
        WHERE c.product.seller.id = :sellerId
    """)
    Long totalCartQuantityBySellerId(Integer sellerId);

    @Query("""
        SELECT c.product.title
        FROM CartItem c
        WHERE c.product.seller.id = :sellerId
        GROUP BY c.product.id, c.product.title
        ORDER BY SUM(c.quantity) DESC
        LIMIT 1
    """)
    String mostAddedProduct(Integer sellerId);

    @Query("""
        SELECT SUM(c.quantity)
        FROM CartItem c
        WHERE c.product.seller.id = :sellerId
        GROUP BY c.product.id
        ORDER BY SUM(c.quantity) DESC
        LIMIT 1
    """)
    Long mostAddedProductCount(Integer sellerId);

    @Query("""
        SELECT MIN(c.addedAt)
        FROM CartItem c
        WHERE c.product.seller.id = :sellerId
    """)
    LocalDateTime oldestCartDate(Integer sellerId);
}
