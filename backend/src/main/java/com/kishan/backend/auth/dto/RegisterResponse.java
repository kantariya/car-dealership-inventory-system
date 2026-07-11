package com.kishan.backend.auth.dto;

public record RegisterResponse(
    Long id,
    String email,
    String name,
    String role
) {}
