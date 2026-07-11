package com.kishan.backend.vehicle.controller;

import com.kishan.backend.vehicle.dto.CreateVehicleRequest;
import com.kishan.backend.vehicle.dto.UpdateVehicleRequest;
import com.kishan.backend.vehicle.dto.VehicleResponse;
import com.kishan.backend.vehicle.service.VehicleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;

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

    /**
     * Endpoint to view a list of all available vehicles.
     *
     * @return the list of available vehicles response DTOs
     */
    @GetMapping
    public java.util.List<VehicleResponse> getAllVehicles() {
        return vehicleService.getAllVehicles();
    }

    /**
     * Endpoint to search for vehicles by make, model, category, or price range.
     *
     * @param make     the vehicle make
     * @param model    the vehicle model
     * @param category the vehicle category
     * @param minPrice the minimum price
     * @param maxPrice the maximum price
     * @return list of matching vehicle response DTOs
     */
    @GetMapping("/search")
    public java.util.List<VehicleResponse> searchVehicles(
            @RequestParam(required = false) String make,
            @RequestParam(required = false) String model,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice
    ) {
        return vehicleService.searchVehicles(make, model, category, minPrice, maxPrice);
    }

    /**
     * Endpoint to update an existing vehicle's details.
     *
     * @param id      the ID of the vehicle to update
     * @param request the updated vehicle details
     * @return the updated vehicle response details
     */
    @PutMapping("/{id}")
    public VehicleResponse updateVehicle(
            @PathVariable Long id,
            @Valid @RequestBody UpdateVehicleRequest request
    ) {
        return vehicleService.updateVehicle(id, request);
    }

    /**
     * Endpoint to delete a vehicle from the inventory.
     *
     * @param id the ID of the vehicle to delete
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
    }
}
