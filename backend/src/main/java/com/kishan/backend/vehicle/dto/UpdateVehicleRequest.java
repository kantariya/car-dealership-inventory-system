package com.kishan.backend.vehicle.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;

/**
 * DTO representing a request to update an existing vehicle's details.
 */
public record UpdateVehicleRequest(
        @NotBlank(message = "Make cannot be blank")
        String make,

        @NotBlank(message = "Model cannot be blank")
        String model,

        @NotBlank(message = "Category cannot be blank")
        String category,

        @DecimalMin(value = "0.0", message = "Price cannot be negative")
        BigDecimal price,

        @Min(value = 0, message = "Quantity cannot be negative")
        Integer quantity
) {}
