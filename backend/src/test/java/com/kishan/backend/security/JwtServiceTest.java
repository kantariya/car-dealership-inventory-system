package com.kishan.backend.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;
    
    // A 256-bit test secret (64 characters) suitable for HMAC-SHA256
    private static final String TEST_SECRET = "3c9e4d1b7f8c5e6d2b3a4f5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e";
    private static final long TEST_EXPIRATION = 3600000; // 1 hour

    @BeforeEach
    void setUp() {
        jwtService = new JwtService(TEST_SECRET, TEST_EXPIRATION);
    }

    @Test
    void generateToken_ShouldGenerateValidToken() {
        String email = "user@example.com";
        String role = "ROLE_USER";

        String token = jwtService.generateToken(email, role);

        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void extractEmail_ShouldExtractCorrectEmail() {
        String email = "admin@example.com";
        String role = "ROLE_ADMIN";

        String token = jwtService.generateToken(email, role);
        String extractedEmail = jwtService.extractEmail(token);

        assertEquals(email, extractedEmail);
    }

    @Test
    void extractRole_ShouldExtractCorrectRole() {
        String email = "user@example.com";
        String role = "ROLE_USER";

        String token = jwtService.generateToken(email, role);
        String extractedRole = jwtService.extractRole(token);

        assertEquals(role, extractedRole);
    }

    @Test
    void validateToken_ShouldReturnTrue_WhenTokenIsValidAndEmailMatches() {
        String email = "user@example.com";
        String role = "ROLE_USER";

        String token = jwtService.generateToken(email, role);
        boolean isValid = jwtService.validateToken(token, email);

        assertTrue(isValid);
    }

    @Test
    void validateToken_ShouldReturnFalse_WhenEmailMismatches() {
        String email = "user@example.com";
        String role = "ROLE_USER";

        String token = jwtService.generateToken(email, role);
        boolean isValid = jwtService.validateToken(token, "mismatch@example.com");

        assertFalse(isValid);
    }
}
