package com.kishan.backend.vehicle.service;

import com.kishan.backend.vehicle.dto.CreateVehicleRequest;
import com.kishan.backend.vehicle.dto.VehicleResponse;
import com.kishan.backend.vehicle.entity.Vehicle;
import com.kishan.backend.vehicle.repository.VehicleRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class VehicleServiceImplTest {

    @Mock
    private VehicleRepository vehicleRepository;

    @InjectMocks
    private VehicleServiceImpl vehicleService;

    @Test
    void createVehicle_ShouldSaveAndReturnVehicle() {
        // Arrange
        CreateVehicleRequest request = new CreateVehicleRequest("Tesla", "Model S", "Electric", new BigDecimal("89990.00"), 3);
        Vehicle savedVehicle = Vehicle.builder()
                .id(1L)
                .make("Tesla")
                .model("Model S")
                .category("Electric")
                .price(new BigDecimal("89990.00"))
                .quantity(3)
                .build();

        when(vehicleRepository.save(any(Vehicle.class))).thenReturn(savedVehicle);

        // Act
        VehicleResponse response = vehicleService.createVehicle(request);

        // Assert
        assertNotNull(response);
        assertEquals(1L, response.id());
        assertEquals("Tesla", response.make());
        assertEquals("Model S", response.model());
        assertEquals("Electric", response.category());
        assertEquals(new BigDecimal("89990.00"), response.price());
        assertEquals(3, response.quantity());

        ArgumentCaptor<Vehicle> vehicleCaptor = ArgumentCaptor.forClass(Vehicle.class);
        verify(vehicleRepository).save(vehicleCaptor.capture());

        Vehicle capturedVehicle = vehicleCaptor.getValue();
        assertEquals("Tesla", capturedVehicle.getMake());
        assertEquals("Model S", capturedVehicle.getModel());
        assertEquals("Electric", capturedVehicle.getCategory());
        assertEquals(new BigDecimal("89990.00"), capturedVehicle.getPrice());
        assertEquals(3, capturedVehicle.getQuantity());
    }

    @Test
    void getAllVehicles_ShouldReturnListOfVehicles() {
        // Arrange
        Vehicle vehicle1 = Vehicle.builder()
                .id(1L)
                .make("Toyota")
                .model("Camry")
                .category("Sedan")
                .price(new BigDecimal("35000.00"))
                .quantity(5)
                .build();
        Vehicle vehicle2 = Vehicle.builder()
                .id(2L)
                .make("Honda")
                .model("Accord")
                .category("Sedan")
                .price(new BigDecimal("32000.00"))
                .quantity(3)
                .build();

        when(vehicleRepository.findAll()).thenReturn(java.util.List.of(vehicle1, vehicle2));

        // Act
        java.util.List<VehicleResponse> responses = vehicleService.getAllVehicles();

        // Assert
        assertNotNull(responses);
        assertEquals(2, responses.size());
        assertEquals("Toyota", responses.get(0).make());
        assertEquals("Honda", responses.get(1).make());
    }

    @Test
    void searchVehicles_ShouldReturnFilteredVehicles() {
        // Arrange
        Vehicle vehicle1 = Vehicle.builder()
                .id(1L)
                .make("Toyota")
                .model("Camry")
                .category("Sedan")
                .price(new BigDecimal("35000.00"))
                .quantity(5)
                .build();

        when(vehicleRepository.findAll(any(org.springframework.data.jpa.domain.Specification.class)))
                .thenReturn(java.util.List.of(vehicle1));

        // Act
        java.util.List<VehicleResponse> responses = vehicleService.searchVehicles("Toyota", null, null, new BigDecimal("30000.00"), null);

        // Assert
        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals("Toyota", responses.get(0).make());
        assertEquals("Camry", responses.get(0).model());
    }
}
