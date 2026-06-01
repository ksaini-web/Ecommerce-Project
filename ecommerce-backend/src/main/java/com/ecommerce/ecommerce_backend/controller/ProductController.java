package com.ecommerce.ecommerce_backend.controller;

import com.ecommerce.ecommerce_backend.dto.AddProductRequest;
import com.ecommerce.ecommerce_backend.dto.SellerAnalyticsResponse;
import com.ecommerce.ecommerce_backend.entity.Product;
import com.ecommerce.ecommerce_backend.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ecommerce.ecommerce_backend.dto.AddProductRequest;
import jakarta.validation.Valid;
import com.ecommerce.ecommerce_backend.dto.SellerAnalyticsResponse;
import com.ecommerce.ecommerce_backend.dto.UpdateProductRequest;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{productId}")
    public ResponseEntity<Product> getProductById(
            @PathVariable Long productId
    ) {
        return ResponseEntity.ok(productService.getProductById(productId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(
            @RequestParam String keyword
    ) {
        return ResponseEntity.ok(productService.searchProducts(keyword));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getProductsByCategory(
            @PathVariable String category
    ) {
        return ResponseEntity.ok(productService.getProductsByCategory(category));
    }

    @PostMapping
    public ResponseEntity<Product> addProduct(
            @Valid @RequestBody AddProductRequest request
    ) {
        return ResponseEntity.ok(productService.addProduct(request));
    }

    @GetMapping("/seller/{sellerId}/analytics")
    public ResponseEntity<SellerAnalyticsResponse> getSellerAnalytics(
            @PathVariable Integer sellerId
    ) {
        return ResponseEntity.ok(
                productService.getSellerAnalytics(sellerId)
        );
    }

    @PutMapping("/{productId}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long productId,
            @Valid @RequestBody UpdateProductRequest request
    ) {
        return ResponseEntity.ok(
                productService.updateProduct(productId, request)
        );
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<String> deleteProduct(
            @PathVariable Long productId
    ) {
        return ResponseEntity.ok(
                productService.deleteProduct(productId)
        );
    }
}
