package com.kishan.backend.vehicle.service;

import com.kishan.backend.vehicle.dto.CreateVehicleRequest;
import com.kishan.backend.vehicle.dto.VehicleResponse;
import com.kishan.backend.vehicle.entity.Vehicle;
import com.kishan.backend.vehicle.repository.VehicleRepository;
import java.math.BigDecimal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        org.springframework.data.jpa.domain.Specification<Vehicle> spec = buildSearchSpecification(make, model, category, minPrice, maxPrice);

        return vehicleRepository.findAll(spec).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional
    public VehicleResponse updateVehicle(Long id, com.kishan.backend.vehicle.dto.UpdateVehicleRequest request) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new com.kishan.backend.common.exception.ResourceNotFoundException("Vehicle not found"));

        updateVehicleFields(vehicle, request);

        Vehicle updatedVehicle = vehicleRepository.save(vehicle);
        return mapToResponse(updatedVehicle);
    }

    @Override
    @Transactional
    public void deleteVehicle(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new com.kishan.backend.common.exception.ResourceNotFoundException("Vehicle not found"));
        vehicleRepository.delete(vehicle);
    }

    private void updateVehicleFields(Vehicle vehicle, com.kishan.backend.vehicle.dto.UpdateVehicleRequest request) {
        vehicle.setMake(request.make());
        vehicle.setModel(request.model());
        vehicle.setCategory(request.category());
        vehicle.setPrice(request.price());
        vehicle.setQuantity(request.quantity());
    }

    private org.springframework.data.jpa.domain.Specification<Vehicle> buildSearchSpecification(
            String make, String model, String category, BigDecimal minPrice, BigDecimal maxPrice
    ) {
        org.springframework.data.jpa.domain.Specification<Vehicle> spec = org.springframework.data.jpa.domain.Specification.where(null);

        if (make != null && !make.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.equal(cb.lower(root.get("make")), make.toLowerCase()));
        }
        if (model != null && !model.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.equal(cb.lower(root.get("model")), model.toLowerCase()));
        }
        if (category != null && !category.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.equal(cb.lower(root.get("category")), category.toLowerCase()));
        }
        if (minPrice != null) {
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("price"), minPrice));
        }
        if (maxPrice != null) {
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("price"), maxPrice));
        }

        return spec;
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
