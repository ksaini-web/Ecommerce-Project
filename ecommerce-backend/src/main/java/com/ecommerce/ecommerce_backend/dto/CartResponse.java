package com.ecommerce.ecommerce_backend.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartResponse {

    private Integer id;

    private Integer userId;

    private Long productId;

    private String productTitle;

    private String thumbnail;

    private BigDecimal price;

    private Integer quantity;

    private LocalDateTime addedAt;
}