package com.kishan.backend.auth.controller;

import com.kishan.backend.auth.dto.RegisterRequest;
import com.kishan.backend.auth.dto.RegisterResponse;
import com.kishan.backend.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller exposing endpoints for user authentication actions (e.g. registration).
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Endpoint to register a new user in the system.
     * Maps to HTTP POST /api/auth/register.
     *
     * @param request the validated registration request body
     * @return the response entity containing registered user details and HTTP 201 status
     */
    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }
}
