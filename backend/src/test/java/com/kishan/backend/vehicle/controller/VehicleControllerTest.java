package com.kishan.backend.vehicle.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kishan.backend.common.exception.GlobalExceptionHandler;
import com.kishan.backend.security.JwtService;
import com.kishan.backend.vehicle.dto.CreateVehicleRequest;
import com.kishan.backend.vehicle.dto.UpdateVehicleRequest;
import com.kishan.backend.vehicle.dto.RestockVehicleRequest;
import com.kishan.backend.vehicle.dto.VehicleResponse;
import com.kishan.backend.vehicle.service.VehicleService;
import com.kishan.backend.security.SecurityConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = VehicleController.class)
@Import({GlobalExceptionHandler.class, SecurityConfig.class})
class VehicleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private VehicleService vehicleService;

    @MockitoBean
    private JwtService jwtService; // required for loading security configuration

    @Test
    @WithMockUser(username = "admin@example.com", roles = {"ADMIN"})
    void createVehicle_ShouldReturn201Created_WhenUserIsAdminAndRequestIsValid() throws Exception {
        CreateVehicleRequest request = new CreateVehicleRequest("Toyota", "Camry", "Sedan", new BigDecimal("35000.00"), 5);
        VehicleResponse response = new VehicleResponse(1L, "Toyota", "Camry", "Sedan", new BigDecimal("35000.00"), 5);

        when(vehicleService.createVehicle(any(CreateVehicleRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/vehicles")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.make").value("Toyota"))
                .andExpect(jsonPath("$.model").value("Camry"))
                .andExpect(jsonPath("$.category").value("Sedan"))
                .andExpect(jsonPath("$.price").value(35000.00))
                .andExpect(jsonPath("$.quantity").value(5));
    }

    @Test
    @WithMockUser(username = "user@example.com", roles = {"USER"})
    void createVehicle_ShouldReturn403Forbidden_WhenUserIsNotAdmin() throws Exception {
        CreateVehicleRequest request = new CreateVehicleRequest("Toyota", "Camry", "Sedan", new BigDecimal("35000.00"), 5);

        mockMvc.perform(post("/api/vehicles")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    void createVehicle_ShouldReturn401Unauthorized_WhenUserIsUnauthenticated() throws Exception {
        CreateVehicleRequest request = new CreateVehicleRequest("Toyota", "Camry", "Sedan", new BigDecimal("35000.00"), 5);

        mockMvc.perform(post("/api/vehicles")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "admin@example.com", roles = {"ADMIN"})
    void createVehicle_ShouldReturn400BadRequest_WhenValidationFails() throws Exception {
        CreateVehicleRequest invalidRequest = new CreateVehicleRequest("", "", "", new BigDecimal("-1.00"), -5);

        mockMvc.perform(post("/api/vehicles")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Validation failed"))
                .andExpect(jsonPath("$.errors.make").value("Make cannot be blank"))
                .andExpect(jsonPath("$.errors.model").value("Model cannot be blank"))
                .andExpect(jsonPath("$.errors.category").value("Category cannot be blank"))
                .andExpect(jsonPath("$.errors.price").value("Price cannot be negative"))
                .andExpect(jsonPath("$.errors.quantity").value("Quantity cannot be negative"));
    }

    @Test
    @WithMockUser(username = "user@example.com", roles = {"USER"})
    void getAllVehicles_ShouldReturn200Ok_WhenUserIsAuthenticated() throws Exception {
        VehicleResponse response1 = new VehicleResponse(1L, "Toyota", "Camry", "Sedan", new BigDecimal("35000.00"), 5);
        VehicleResponse response2 = new VehicleResponse(2L, "Honda", "Accord", "Sedan", new BigDecimal("32000.00"), 3);

        when(vehicleService.getAllVehicles()).thenReturn(List.of(response1, response2));

        mockMvc.perform(get("/api/vehicles")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].make").value("Toyota"))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].make").value("Honda"));
    }

    @Test
    void getAllVehicles_ShouldReturn401Unauthorized_WhenUserIsUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/vehicles")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "user@example.com", roles = {"USER"})
    void searchVehicles_ShouldReturn200OkAndMatchingVehicles_WhenParamsAreValid() throws Exception {
        VehicleResponse response = new VehicleResponse(1L, "Toyota", "Camry", "Sedan", new BigDecimal("35000.00"), 5);

        when(vehicleService.searchVehicles("Toyota", null, null, new BigDecimal("30000.00"), null))
                .thenReturn(List.of(response));

        mockMvc.perform(get("/api/vehicles/search")
                .param("make", "Toyota")
                .param("minPrice", "30000.00")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].make").value("Toyota"))
                .andExpect(jsonPath("$[0].model").value("Camry"));
    }

    @Test
    void searchVehicles_ShouldReturn401Unauthorized_WhenUserIsUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/vehicles/search")
                .param("make", "Toyota")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "admin@example.com", roles = {"ADMIN"})
    void updateVehicle_ShouldReturn200Ok_WhenUserIsAdminAndVehicleExists() throws Exception {
        UpdateVehicleRequest request = new UpdateVehicleRequest("Toyota", "Camry Hybrid", "Sedan", new BigDecimal("38000.00"), 4);
        VehicleResponse response = new VehicleResponse(1L, "Toyota", "Camry Hybrid", "Sedan", new BigDecimal("38000.00"), 4);

        when(vehicleService.updateVehicle(any(Long.class), any(UpdateVehicleRequest.class))).thenReturn(response);

        mockMvc.perform(put("/api/vehicles/1")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.model").value("Camry Hybrid"))
                .andExpect(jsonPath("$.quantity").value(4));
    }

    @Test
    @WithMockUser(username = "admin@example.com", roles = {"ADMIN"})
    void updateVehicle_ShouldReturn404NotFound_WhenVehicleDoesNotExist() throws Exception {
        UpdateVehicleRequest request = new UpdateVehicleRequest("Toyota", "Camry Hybrid", "Sedan", new BigDecimal("38000.00"), 4);

        when(vehicleService.updateVehicle(any(Long.class), any(UpdateVehicleRequest.class)))
                .thenThrow(new com.kishan.backend.common.exception.ResourceNotFoundException("Vehicle not found"));

        mockMvc.perform(put("/api/vehicles/999")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Vehicle not found"));
    }

    @Test
    @WithMockUser(username = "user@example.com", roles = {"USER"})
    void updateVehicle_ShouldReturn403Forbidden_WhenUserIsNotAdmin() throws Exception {
        UpdateVehicleRequest request = new UpdateVehicleRequest("Toyota", "Camry Hybrid", "Sedan", new BigDecimal("38000.00"), 4);

        mockMvc.perform(put("/api/vehicles/1")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    void updateVehicle_ShouldReturn401Unauthorized_WhenUserIsUnauthenticated() throws Exception {
        UpdateVehicleRequest request = new UpdateVehicleRequest("Toyota", "Camry Hybrid", "Sedan", new BigDecimal("38000.00"), 4);

        mockMvc.perform(put("/api/vehicles/1")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "admin@example.com", roles = {"ADMIN"})
    void updateVehicle_ShouldReturn400BadRequest_WhenValidationFails() throws Exception {
        UpdateVehicleRequest invalidRequest = new UpdateVehicleRequest("", "", "", new BigDecimal("-1.00"), -5);

        mockMvc.perform(put("/api/vehicles/1")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Validation failed"))
                .andExpect(jsonPath("$.errors.make").value("Make cannot be blank"))
                .andExpect(jsonPath("$.errors.model").value("Model cannot be blank"))
                .andExpect(jsonPath("$.errors.category").value("Category cannot be blank"))
                .andExpect(jsonPath("$.errors.price").value("Price cannot be negative"))
                .andExpect(jsonPath("$.errors.quantity").value("Quantity cannot be negative"));
    }

    @Test
    @WithMockUser(username = "admin@example.com", roles = {"ADMIN"})
    void deleteVehicle_ShouldReturn204NoContent_WhenUserIsAdminAndVehicleExists() throws Exception {
        mockMvc.perform(delete("/api/vehicles/1")
                .with(csrf()))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(username = "admin@example.com", roles = {"ADMIN"})
    void deleteVehicle_ShouldReturn404NotFound_WhenVehicleDoesNotExist() throws Exception {
        org.mockito.Mockito.doThrow(new com.kishan.backend.common.exception.ResourceNotFoundException("Vehicle not found"))
                .when(vehicleService).deleteVehicle(999L);

        mockMvc.perform(delete("/api/vehicles/999")
                .with(csrf()))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Vehicle not found"));
    }

    @Test
    @WithMockUser(username = "user@example.com", roles = {"USER"})
    void deleteVehicle_ShouldReturn403Forbidden_WhenUserIsNotAdmin() throws Exception {
        mockMvc.perform(delete("/api/vehicles/1")
                .with(csrf()))
                .andExpect(status().isForbidden());
    }

    @Test
    void deleteVehicle_ShouldReturn401Unauthorized_WhenUserIsUnauthenticated() throws Exception {
        mockMvc.perform(delete("/api/vehicles/1")
                .with(csrf()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "user@example.com", roles = {"USER"})
    void purchaseVehicle_ShouldReturn200Ok_WhenVehicleExistsAndInStock() throws Exception {
        VehicleResponse response = new VehicleResponse(1L, "Toyota", "Camry", "Sedan", new BigDecimal("35000.00"), 4);

        when(vehicleService.purchaseVehicle(1L)).thenReturn(response);

        mockMvc.perform(post("/api/vehicles/1/purchase")
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.quantity").value(4));
    }

    @Test
    @WithMockUser(username = "user@example.com", roles = {"USER"})
    void purchaseVehicle_ShouldReturn400BadRequest_WhenOutOfStock() throws Exception {
        when(vehicleService.purchaseVehicle(1L))
                .thenThrow(new com.kishan.backend.vehicle.exception.OutOfStockException("Vehicle is out of stock"));

        mockMvc.perform(post("/api/vehicles/1/purchase")
                .with(csrf()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Vehicle is out of stock"));
    }

    @Test
    @WithMockUser(username = "user@example.com", roles = {"USER"})
    void purchaseVehicle_ShouldReturn404NotFound_WhenVehicleDoesNotExist() throws Exception {
        when(vehicleService.purchaseVehicle(999L))
                .thenThrow(new com.kishan.backend.common.exception.ResourceNotFoundException("Vehicle not found"));

        mockMvc.perform(post("/api/vehicles/999/purchase")
                .with(csrf()))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Vehicle not found"));
    }

    @Test
    void purchaseVehicle_ShouldReturn401Unauthorized_WhenUserIsUnauthenticated() throws Exception {
        mockMvc.perform(post("/api/vehicles/1/purchase")
                .with(csrf()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "admin@example.com", roles = {"ADMIN"})
    void restockVehicle_ShouldReturn200Ok_WhenUserIsAdminAndRequestIsValid() throws Exception {
        RestockVehicleRequest request = new RestockVehicleRequest(5);
        VehicleResponse response = new VehicleResponse(1L, "Toyota", "Camry", "Sedan", new BigDecimal("35000.00"), 10);

        when(vehicleService.restockVehicle(any(Long.class), any(RestockVehicleRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/vehicles/1/restock")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.quantity").value(10));
    }

    @Test
    @WithMockUser(username = "admin@example.com", roles = {"ADMIN"})
    void restockVehicle_ShouldReturn400BadRequest_WhenValidationFails() throws Exception {
        RestockVehicleRequest invalidRequest = new RestockVehicleRequest(0);

        mockMvc.perform(post("/api/vehicles/1/restock")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Validation failed"))
                .andExpect(jsonPath("$.errors.quantity").value("Restock quantity must be greater than zero"));
    }

    @Test
    @WithMockUser(username = "admin@example.com", roles = {"ADMIN"})
    void restockVehicle_ShouldReturn404NotFound_WhenVehicleDoesNotExist() throws Exception {
        RestockVehicleRequest request = new RestockVehicleRequest(5);

        when(vehicleService.restockVehicle(any(Long.class), any(RestockVehicleRequest.class)))
                .thenThrow(new com.kishan.backend.common.exception.ResourceNotFoundException("Vehicle not found"));

        mockMvc.perform(post("/api/vehicles/999/restock")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Vehicle not found"));
    }

    @Test
    @WithMockUser(username = "user@example.com", roles = {"USER"})
    void restockVehicle_ShouldReturn403Forbidden_WhenUserIsNotAdmin() throws Exception {
        RestockVehicleRequest request = new RestockVehicleRequest(5);

        mockMvc.perform(post("/api/vehicles/1/restock")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    void restockVehicle_ShouldReturn401Unauthorized_WhenUserIsUnauthenticated() throws Exception {
        RestockVehicleRequest request = new RestockVehicleRequest(5);

        mockMvc.perform(post("/api/vehicles/1/restock")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }
}
