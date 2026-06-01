package com.ecommerce.ecommerce_backend.service;

import com.ecommerce.ecommerce_backend.dto.*;
import com.ecommerce.ecommerce_backend.entity.Seller;
import com.ecommerce.ecommerce_backend.entity.User;
import com.ecommerce.ecommerce_backend.repository.SellerRepository;
import com.ecommerce.ecommerce_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.ecommerce.ecommerce_backend.config.JwtService;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final SellerRepository sellerRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public String userSignup(UserSignupRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return "This email is already registered";
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepository.save(user);

        return "User registered successfully";
    }

    public AuthResponse userLogin(UserLoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("No account found with this email"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )) {
            throw new RuntimeException("Incorrect password");
        }

        return AuthResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .token(jwtService.generateToken(user.getEmail(), "USER"))
                .role("USER")
                .build();
    }

    public String sellerSignup(SellerSignupRequest request) {

        if (sellerRepository.existsByEmail(request.getEmail())) {
            return "This seller email is already registered";
        }

        Seller seller = Seller.builder()
                .sellerName(request.getSellerName())
                .businessName(request.getBusinessName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .address(request.getAddress())
                .status("approved")
                .build();

        sellerRepository.save(seller);

        return "Seller registered successfully";
    }

    public AuthResponse sellerLogin(SellerLoginRequest request) {

        Seller seller = sellerRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Seller account not found"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                seller.getPassword()
        )) {
            throw new RuntimeException("Incorrect password");
        }

        return AuthResponse.builder()
                .id(seller.getId())
                .name(seller.getSellerName())
                .email(seller.getEmail())
                .token(jwtService.generateToken(seller.getEmail(), "SELLER"))
                .role("SELLER")
                .build();
    }
}
