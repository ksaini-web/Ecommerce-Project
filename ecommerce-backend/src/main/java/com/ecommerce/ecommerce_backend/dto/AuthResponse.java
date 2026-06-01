package com.ecommerce.ecommerce_backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private Integer id;

    private String name;

    private String email;

    private String token;

    private String role;
}