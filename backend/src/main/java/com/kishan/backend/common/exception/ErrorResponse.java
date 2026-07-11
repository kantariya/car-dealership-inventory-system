package com.kishan.backend.common.exception;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Immutable DTO representing a structured API error response.
 *
 * @param status    the HTTP status code (e.g., 400, 404, 500)
 * @param message   a descriptive error message
 * @param timestamp the date and time when the error occurred
 * @param errors    optional field-specific validation errors (e.g., validation messages)
 */
public record ErrorResponse(
    int status,
    String message,
    LocalDateTime timestamp,
    Map<String, String> errors
) {}
