package com.kishan.backend.vehicle.dto;

import java.math.BigDecimal;

/**
 * DTO representing a vehicle response.
 */
public record VehicleResponse(
    Long id,
    String make,
    String model,
    String category,
    BigDecimal price,
    Integer quantity
) {}
