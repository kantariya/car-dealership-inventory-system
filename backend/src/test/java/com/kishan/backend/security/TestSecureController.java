package com.kishan.backend.security;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Test-only controller for verifying Spring Security and JWT configuration.
 */
@RestController
public class TestSecureController {

    @GetMapping("/test/secure")
    public String secureEndpoint() {
        return "secure-data";
    }
}
