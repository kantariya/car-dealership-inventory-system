package com.kishan.backend.auth.dto;

/**
 * Data Transfer Object for login responses containing the JWT token and user info.
 */
public record LoginResponse(
    String token,
    String email,
    String name,
    String role
) {}
