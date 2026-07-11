package com.kishan.backend.vehicle.controller;

import com.kishan.backend.vehicle.dto.CreateVehicleRequest;
import com.kishan.backend.vehicle.dto.VehicleResponse;
import com.kishan.backend.vehicle.service.VehicleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller exposing endpoints for vehicle management.
 */
@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    /**
     * Endpoint to add a new vehicle to the inventory.
     *
     * @param request the vehicle creation details
     * @return the created vehicle details
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public VehicleResponse createVehicle(@Valid @RequestBody CreateVehicleRequest request) {
        return vehicleService.createVehicle(request);
    }
}
