package com.kishan.backend.vehicle.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kishan.backend.common.exception.GlobalExceptionHandler;
import com.kishan.backend.security.JwtService;
import com.kishan.backend.vehicle.dto.CreateVehicleRequest;
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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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
}
