package com.kishan.backend.vehicle.service;

import com.kishan.backend.vehicle.dto.CreateVehicleRequest;
import com.kishan.backend.vehicle.dto.VehicleResponse;

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
}
