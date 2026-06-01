package com.ecommerce.ecommerce_backend.service;

import com.ecommerce.ecommerce_backend.dto.*;
import com.ecommerce.ecommerce_backend.entity.Product;
import com.ecommerce.ecommerce_backend.entity.Seller;
import com.ecommerce.ecommerce_backend.repository.CartRepository;
import com.ecommerce.ecommerce_backend.repository.ProductRepository;
import com.ecommerce.ecommerce_backend.repository.SellerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.ecommerce.ecommerce_backend.dto.UpdateProductRequest;

import java.time.LocalDateTime;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final SellerRepository sellerRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long productId) {

        return productRepository.findById(productId)
                .orElseThrow(() ->
                        new RuntimeException("Product not found"));
    }

    public List<Product> getSellerProducts(Integer sellerId) {

        return productRepository.findBySellerId(sellerId);
    }

    public Product addProduct(Product product, Integer sellerId) {

        Seller seller = sellerRepository.findById(sellerId)
                .orElseThrow(() ->
                        new RuntimeException("Seller not found"));

        product.setSeller(seller);

        return productRepository.save(product);
    }

    public List<Product> searchProducts(String keyword) {

        return productRepository
                .findByTitleContainingIgnoreCase(keyword);
    }

    public List<Product> getProductsByCategory(String category) {

        return productRepository.findByCategory(category);
    }

    public Product addProduct(AddProductRequest request) {

        Seller seller = sellerRepository.findById(request.getSellerId())
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        Product product = Product.builder()
                .seller(seller)
                .title(request.getTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .discountPercentage(request.getDiscountPercentage())
                .rating(request.getRating())
                .stock(request.getStock())
                .brand(request.getBrand())
                .category(request.getCategory())
                .thumbnail(request.getThumbnail())
                .images(request.getImages())
                .build();

        return productRepository.save(product);
    }

    public SellerAnalyticsResponse getSellerAnalytics(Integer sellerId) {

        Long totalUsers =
                cartRepository.countDistinctUsersBySellerId(sellerId);

        Long totalQuantity =
                cartRepository.totalCartQuantityBySellerId(sellerId);

        String mostAddedProduct =
                cartRepository.mostAddedProduct(sellerId);

        Long mostAddedCount =
                cartRepository.mostAddedProductCount(sellerId);

        LocalDateTime oldestDate =
                cartRepository.oldestCartDate(sellerId);

        return SellerAnalyticsResponse.builder()
                .totalUsers(totalUsers != null ? totalUsers : 0)
                .totalQuantity(totalQuantity != null ? totalQuantity : 0)
                .mostAddedProduct(
                        mostAddedProduct != null
                                ? mostAddedProduct
                                : "No products"
                )
                .mostAddedCount(
                        mostAddedCount != null
                                ? mostAddedCount
                                : 0
                )
                .oldestCartDate(
                        oldestDate != null
                                ? oldestDate.toString()
                                : "No data"
                )
                .build();
    }

    public Product updateProduct(
            Long productId,
            UpdateProductRequest request
    ) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new RuntimeException("Product not found"));

        product.setTitle(request.getTitle());

        product.setDescription(request.getDescription());

        product.setPrice(request.getPrice());

        product.setDiscountPercentage(
                request.getDiscountPercentage()
        );

        product.setStock(request.getStock());

        product.setBrand(request.getBrand());

        product.setCategory(request.getCategory());

        product.setThumbnail(request.getThumbnail());

        return productRepository.save(product);
    }

    public String deleteProduct(Long productId) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new RuntimeException("Product not found"));

        productRepository.delete(product);

        return "Product deleted successfully";
    }
}
