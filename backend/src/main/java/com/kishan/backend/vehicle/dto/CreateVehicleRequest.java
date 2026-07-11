package com.kishan.backend.vehicle.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

/**
 * DTO representing a request to create a new vehicle.
 */
public record CreateVehicleRequest(
    @NotBlank(message = "Make cannot be blank")
    String make,

    @NotBlank(message = "Model cannot be blank")
    String model,

    @NotBlank(message = "Category cannot be blank")
    String category,

    @NotNull(message = "Price cannot be null")
    @DecimalMin(value = "0.0", inclusive = true, message = "Price cannot be negative")
    BigDecimal price,

    @NotNull(message = "Quantity cannot be null")
    @Min(value = 0, message = "Quantity cannot be negative")
    Integer quantity
) {}
