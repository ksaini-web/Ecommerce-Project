package com.ecommerce.ecommerce_backend.controller;

import com.ecommerce.ecommerce_backend.dto.*;
import com.ecommerce.ecommerce_backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/user/signup")
    public ResponseEntity<String> userSignup(
            @Valid @RequestBody UserSignupRequest request
    ) {
        return ResponseEntity.ok(authService.userSignup(request));
    }

    @PostMapping("/user/login")
    public ResponseEntity<AuthResponse> userLogin(
            @Valid @RequestBody UserLoginRequest request
    ) {
        return ResponseEntity.ok(authService.userLogin(request));
    }

    @PostMapping("/seller/signup")
    public ResponseEntity<String> sellerSignup(
            @Valid @RequestBody SellerSignupRequest request
    ) {
        return ResponseEntity.ok(authService.sellerSignup(request));
    }

    @PostMapping("/seller/login")
    public ResponseEntity<AuthResponse> sellerLogin(
            @Valid @RequestBody SellerLoginRequest request
    ) {
        return ResponseEntity.ok(authService.sellerLogin(request));
    }
}
