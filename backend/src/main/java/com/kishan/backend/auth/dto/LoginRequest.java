package com.kishan.backend.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * Data Transfer Object for incoming login requests.
 */
public record LoginRequest(
    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Email must be a valid email address")
    String email,

    @NotBlank(message = "Password cannot be blank")
    String password
) {}
