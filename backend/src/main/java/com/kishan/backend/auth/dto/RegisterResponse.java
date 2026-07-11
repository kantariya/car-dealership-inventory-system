package com.kishan.backend.auth.dto;

/**
 * Data Transfer Object (DTO) representing the response returned after a successful user registration.
 * Excludes sensitive fields like the hashed password.
 */
public record RegisterResponse(
    Long id,
    String email,
    String name,
    String role
) {}
