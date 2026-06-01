package com.ecommerce.ecommerce_backend.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddProductRequest {

    @NotNull(message = "Seller ID is required")
    private Integer sellerId;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Price is required")
    private BigDecimal price;

    private Double discountPercentage;

    private Double rating;

    private Integer stock;

    private String brand;

    private String category;

    private String thumbnail;

    private String images;
}
