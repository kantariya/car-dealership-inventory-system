package com.kishan.backend.common.exception;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestExceptionController {
    @GetMapping("/test/generic-exception")
    public void throwGenericException() {
        throw new RuntimeException("Something went wrong");
    }

    @GetMapping("/test/not-found-exception")
    public void throwNotFoundException() {
        throw new ResourceNotFoundException("Vehicle not found");
    }

    @PostMapping("/test/validation")
    public void testValidation(@Valid @RequestBody TestDto dto) {
    }
}
