package com.kishan.backend.auth.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kishan.backend.auth.dto.LoginRequest;
import com.kishan.backend.auth.dto.LoginResponse;
import com.kishan.backend.auth.dto.RegisterRequest;
import com.kishan.backend.auth.dto.RegisterResponse;
import com.kishan.backend.auth.exception.EmailAlreadyExistsException;
import com.kishan.backend.auth.service.AuthService;
import com.kishan.backend.common.exception.GlobalExceptionHandler;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(
    controllers = AuthController.class,
    excludeAutoConfiguration = {
        SecurityAutoConfiguration.class,
        UserDetailsServiceAutoConfiguration.class
    }
)
@Import(GlobalExceptionHandler.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private AuthService authService;

    @Test
    void register_ShouldReturn201Created_WhenRequestIsValid() throws Exception {
        RegisterRequest request = new RegisterRequest("jane.doe@example.com", "secure123", "Jane Doe");
        RegisterResponse response = new RegisterResponse(1L, "jane.doe@example.com", "Jane Doe", "USER");

        when(authService.register(any(RegisterRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.email").value("jane.doe@example.com"))
                .andExpect(jsonPath("$.name").value("Jane Doe"))
                .andExpect(jsonPath("$.role").value("USER"));
    }

    @Test
    void register_ShouldReturn400BadRequest_WhenValidationFails() throws Exception {
        RegisterRequest invalidRequest = new RegisterRequest("", "short", ""); // Blank email, short password, blank name

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Validation failed"))
                .andExpect(jsonPath("$.errors.email").exists())
                .andExpect(jsonPath("$.errors.password").value("Password must be at least 6 characters long"))
                .andExpect(jsonPath("$.errors.name").value("Name cannot be blank"));
    }

    @Test
    void register_ShouldReturn400BadRequest_WhenEmailAlreadyExists() throws Exception {
        RegisterRequest request = new RegisterRequest("jane.doe@example.com", "secure123", "Jane Doe");

        when(authService.register(any(RegisterRequest.class)))
                .thenThrow(new EmailAlreadyExistsException("Email address already in use: jane.doe@example.com"));

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Email address already in use: jane.doe@example.com"));
    }

    @Test
    void login_ShouldReturn200Ok_WhenRequestIsValid() throws Exception {
        LoginRequest request = new LoginRequest("jane.doe@example.com", "secure123");
        LoginResponse response = new LoginResponse("stub-jwt-token", "jane.doe@example.com", "Jane Doe", "USER");

        when(authService.login(any(LoginRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("stub-jwt-token"))
                .andExpect(jsonPath("$.email").value("jane.doe@example.com"))
                .andExpect(jsonPath("$.name").value("Jane Doe"))
                .andExpect(jsonPath("$.role").value("USER"));
    }

    @Test
    void login_ShouldReturn400BadRequest_WhenValidationFails() throws Exception {
        LoginRequest invalidRequest = new LoginRequest("invalid-email", ""); // Invalid email format, blank password

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Validation failed"))
                .andExpect(jsonPath("$.errors.email").value("Email must be a valid email address"))
                .andExpect(jsonPath("$.errors.password").value("Password cannot be blank"));
    }

    @Test
    void login_ShouldReturn401Unauthorized_WhenCredentialsAreInvalid() throws Exception {
        LoginRequest request = new LoginRequest("jane.doe@example.com", "wrongPassword");

        when(authService.login(any(LoginRequest.class)))
                .thenThrow(new BadCredentialsException("Invalid email or password"));

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.message").value("Invalid email or password"));
    }
}
