package com.ecommerce.ecommerce_backend.controller;

import com.ecommerce.ecommerce_backend.dto.AddToCartRequest;
import com.ecommerce.ecommerce_backend.dto.CartResponse;
import com.ecommerce.ecommerce_backend.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping
    public ResponseEntity<CartResponse> addToCart(
            @Valid @RequestBody AddToCartRequest request
    ) {
        return ResponseEntity.ok(cartService.addToCart(request));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CartResponse>> getUserCart(
            @PathVariable Integer userId
    ) {
        return ResponseEntity.ok(cartService.getUserCart(userId));
    }

    @PutMapping("/{cartItemId}")
    public ResponseEntity<CartResponse> updateCartItem(
            @PathVariable Integer cartItemId,
            @RequestBody CartQuantityRequest request
    ) {
        return ResponseEntity.ok(
                cartService.updateCartItem(
                        cartItemId,
                        request.getQuantity()
                )
        );
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<String> removeCartItem(
            @PathVariable Integer cartItemId
    ) {
        return ResponseEntity.ok(
                cartService.removeCartItem(cartItemId)
        );
    }

    public static class CartQuantityRequest {

        private Integer quantity;

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
    }
}
