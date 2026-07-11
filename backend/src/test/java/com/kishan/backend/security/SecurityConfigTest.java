package com.kishan.backend.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = TestSecureController.class)
@Import(SecurityConfig.class)
class SecurityConfigTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private JwtService jwtService;

    @Test
    void secureEndpoint_ShouldReturn401Unauthorized_WhenNoTokenIsProvided() throws Exception {
        mockMvc.perform(get("/test/secure")
                .accept(MediaType.TEXT_PLAIN))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void secureEndpoint_ShouldReturn401Unauthorized_WhenTokenIsInvalid() throws Exception {
        String invalidToken = "invalid-token";
        when(jwtService.extractEmail(invalidToken)).thenThrow(new RuntimeException("Invalid token"));

        mockMvc.perform(get("/test/secure")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + invalidToken)
                .accept(MediaType.TEXT_PLAIN))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void secureEndpoint_ShouldReturn200Ok_WhenTokenIsValid() throws Exception {
        String validToken = "valid-token";
        String email = "user@example.com";
        String role = "USER";

        when(jwtService.extractEmail(validToken)).thenReturn(email);
        when(jwtService.extractRole(validToken)).thenReturn(role);
        when(jwtService.validateToken(validToken, email)).thenReturn(true);

        mockMvc.perform(get("/test/secure")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + validToken)
                .accept(MediaType.TEXT_PLAIN))
                .andExpect(status().isOk())
                .andExpect(content().string("secure-data"));
    }
}
