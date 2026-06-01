package com.ecommerce.ecommerce_backend.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateProductRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Price is required")
    private BigDecimal price;

    private Double discountPercentage;

    private Integer stock;

    private String brand;

    private String category;

    private String thumbnail;
}