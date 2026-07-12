package com.kishan.backend.vehicle.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/**
 * DTO representing a request to restock a vehicle.
 */
public record RestockVehicleRequest(
        @NotNull(message = "Quantity is required")
        @Min(value = 1, message = "Restock quantity must be greater than zero")
        Integer quantity
) {}
