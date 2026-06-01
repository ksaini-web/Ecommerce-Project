package com.ecommerce.ecommerce_backend.repository;

import com.ecommerce.ecommerce_backend.entity.Product;
import com.ecommerce.ecommerce_backend.entity.Seller;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findBySeller(Seller seller);

    List<Product> findBySellerId(Integer sellerId);

    List<Product> findByCategory(String category);

    List<Product> findByTitleContainingIgnoreCase(String keyword);
}