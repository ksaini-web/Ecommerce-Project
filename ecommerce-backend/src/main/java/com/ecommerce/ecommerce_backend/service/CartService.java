package com.ecommerce.ecommerce_backend.service;

import com.ecommerce.ecommerce_backend.dto.AddToCartRequest;
import com.ecommerce.ecommerce_backend.dto.CartResponse;
import com.ecommerce.ecommerce_backend.entity.CartItem;
import com.ecommerce.ecommerce_backend.entity.Product;
import com.ecommerce.ecommerce_backend.entity.User;
import com.ecommerce.ecommerce_backend.repository.CartRepository;
import com.ecommerce.ecommerce_backend.repository.ProductRepository;
import com.ecommerce.ecommerce_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public CartResponse addToCart(AddToCartRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem existingCartItem = cartRepository
                .findByUserIdAndProductId(request.getUserId(), request.getProductId())
                .orElse(null);

        if (existingCartItem != null) {
            existingCartItem.setQuantity(
                    existingCartItem.getQuantity() + request.getQuantity()
            );

            return mapToCartResponse(cartRepository.save(existingCartItem));
        }

        CartItem cartItem = CartItem.builder()
                .user(user)
                .product(product)
                .quantity(request.getQuantity())
                .build();

        return mapToCartResponse(cartRepository.save(cartItem));
    }

    public List<CartResponse> getUserCart(Integer userId) {
        return cartRepository.findByUserId(userId)
                .stream()
                .map(this::mapToCartResponse)
                .collect(Collectors.toList());
    }

    public CartResponse updateCartItem(Integer cartItemId, Integer quantity) {

        if (quantity < 1) {
            throw new RuntimeException("Quantity must be at least 1");
        }

        CartItem cartItem = cartRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        cartItem.setQuantity(quantity);

        return mapToCartResponse(cartRepository.save(cartItem));
    }

    public String removeCartItem(Integer cartItemId) {

        CartItem cartItem = cartRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        cartRepository.delete(cartItem);

        return "Cart item removed successfully";
    }

    private CartResponse mapToCartResponse(CartItem cartItem) {
        return CartResponse.builder()
                .id(cartItem.getId())
                .userId(cartItem.getUser().getId())
                .productId(cartItem.getProduct().getId())
                .productTitle(cartItem.getProduct().getTitle())
                .thumbnail(cartItem.getProduct().getThumbnail())
                .price(cartItem.getProduct().getPrice())
                .quantity(cartItem.getQuantity())
                .addedAt(cartItem.getAddedAt())
                .build();
    }
}
