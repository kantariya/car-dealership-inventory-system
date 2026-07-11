package com.kishan.backend.vehicle.service;

import com.kishan.backend.vehicle.dto.CreateVehicleRequest;
import com.kishan.backend.vehicle.dto.VehicleResponse;
import java.math.BigDecimal;

/**
 * Service interface for vehicle business logic.
 */
public interface VehicleService {

    /**
     * Creates a new vehicle in the system.
     *
     * @param request the details of the vehicle to create
     * @return the created vehicle details DTO
     */
    VehicleResponse createVehicle(CreateVehicleRequest request);

    /**
     * Retrieves all available vehicles.
     *
     * @return list of vehicle response DTOs
     */
    java.util.List<VehicleResponse> getAllVehicles();

    /**
     * Searches for vehicles matching any combination of the provided criteria.
     *
     * @param make     the vehicle make (optional)
     * @param model    the vehicle model (optional)
     * @param category the vehicle category (optional)
     * @param minPrice the minimum vehicle price (optional)
     * @param maxPrice the maximum vehicle price (optional)
     * @return list of matching vehicle response DTOs
     */
    java.util.List<VehicleResponse> searchVehicles(
            String make,
            String model,
            String category,
            BigDecimal minPrice,
            BigDecimal maxPrice
    );

    /**
     * Updates an existing vehicle's details.
     *
     * @param id      the unique ID of the vehicle to update
     * @param request the updated vehicle details
     * @return the updated vehicle details DTO
     */
    VehicleResponse updateVehicle(Long id, com.kishan.backend.vehicle.dto.UpdateVehicleRequest request);

    /**
     * Deletes an existing vehicle from the system.
     *
     * @param id the unique ID of the vehicle to delete
     */
    void deleteVehicle(Long id);
}
