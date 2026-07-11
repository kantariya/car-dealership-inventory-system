package com.kishan.backend.vehicle.service;

import com.kishan.backend.vehicle.dto.CreateVehicleRequest;
import com.kishan.backend.vehicle.dto.VehicleResponse;
import com.kishan.backend.vehicle.entity.Vehicle;
import com.kishan.backend.vehicle.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * Service implementation for vehicle operations.
 */
@Service
@RequiredArgsConstructor
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;

    @Override
    public VehicleResponse createVehicle(CreateVehicleRequest request) {
        // Map request DTO to entity
        Vehicle vehicle = Vehicle.builder()
                .make(request.make())
                .model(request.model())
                .category(request.category())
                .price(request.price())
                .quantity(request.quantity())
                .build();

        // Save to database
        Vehicle savedVehicle = vehicleRepository.save(vehicle);

        // Map saved entity back to response DTO
        return mapToResponse(savedVehicle);
    }

    /**
     * Maps a Vehicle entity to a VehicleResponse DTO.
     *
     * @param vehicle the saved vehicle entity
     * @return the mapped response DTO
     */
    private VehicleResponse mapToResponse(Vehicle vehicle) {
        return new VehicleResponse(
                vehicle.getId(),
                vehicle.getMake(),
                vehicle.getModel(),
                vehicle.getCategory(),
                vehicle.getPrice(),
                vehicle.getQuantity()
        );
    }
}
