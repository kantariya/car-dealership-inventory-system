package com.kishan.backend.vehicle.service;

import com.kishan.backend.vehicle.dto.CreateVehicleRequest;
import com.kishan.backend.vehicle.dto.VehicleResponse;
import com.kishan.backend.vehicle.entity.Vehicle;
import com.kishan.backend.vehicle.repository.VehicleRepository;
import java.math.BigDecimal;
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
        // Map request DTO to entity and save
        Vehicle vehicle = mapToEntity(request);
        Vehicle savedVehicle = vehicleRepository.save(vehicle);

        // Map saved entity back to response DTO
        return mapToResponse(savedVehicle);
    }

    @Override
    public java.util.List<VehicleResponse> getAllVehicles() {
        return vehicleRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public java.util.List<VehicleResponse> searchVehicles(
            String make,
            String model,
            String category,
            BigDecimal minPrice,
            BigDecimal maxPrice
    ) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    private Vehicle mapToEntity(CreateVehicleRequest request) {
        return Vehicle.builder()
                .make(request.make())
                .model(request.model())
                .category(request.category())
                .price(request.price())
                .quantity(request.quantity())
                .build();
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
