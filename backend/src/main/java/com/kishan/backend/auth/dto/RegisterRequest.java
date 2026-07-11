package com.kishan.backend.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Data Transfer Object (DTO) for incoming user registration requests.
 * Contains field validation rules for email, password, and name.
 */
public record RegisterRequest(
    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Email must be a valid email address")
    String email,

    @NotBlank(message = "Password cannot be blank")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    String password,

    @NotBlank(message = "Name cannot be blank")
    String name
) {}
