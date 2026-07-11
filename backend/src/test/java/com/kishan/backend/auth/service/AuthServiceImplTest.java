package com.kishan.backend.auth.service;

import com.kishan.backend.auth.dto.RegisterRequest;
import com.kishan.backend.auth.dto.RegisterResponse;
import com.kishan.backend.auth.entity.Role;
import com.kishan.backend.auth.entity.User;
import com.kishan.backend.auth.exception.EmailAlreadyExistsException;
import com.kishan.backend.auth.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Spy
    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @InjectMocks
    private AuthServiceImpl authService;

    private RegisterRequest validRequest;

    @BeforeEach
    void setUp() {
        validRequest = new RegisterRequest("john.doe@example.com", "securePassword123", "John Doe");
    }

    @Test
    void register_ShouldRegisterUserSuccessfully_WhenEmailIsUnique() {
        // Arrange
        when(userRepository.existsByEmail(validRequest.email())).thenReturn(false);
        
        User savedUser = User.builder()
                .id(1L)
                .email(validRequest.email())
                .password("hashed_password")
                .name(validRequest.name())
                .role(Role.USER)
                .build();
        
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        // Act
        RegisterResponse response = authService.register(validRequest);

        // Assert
        assertNotNull(response);
        assertEquals(1L, response.id());
        assertEquals(validRequest.email(), response.email());
        assertEquals(validRequest.name(), response.name());
        assertEquals("USER", response.role());

        // Verify password hashing and saving
        verify(passwordEncoder).encode(validRequest.password());
        
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        
        User capturedUser = userCaptor.getValue();
        assertNotEquals(validRequest.password(), capturedUser.getPassword());
        assertTrue(passwordEncoder.matches(validRequest.password(), capturedUser.getPassword()));
        assertEquals(Role.USER, capturedUser.getRole());
    }

    @Test
    void register_ShouldThrowException_WhenEmailAlreadyExists() {
        // Arrange
        when(userRepository.existsByEmail(validRequest.email())).thenReturn(true);

        // Act & Assert
        EmailAlreadyExistsException exception = assertThrows(
                EmailAlreadyExistsException.class,
                () -> authService.register(validRequest)
        );
        
        assertEquals("Email address already in use: john.doe@example.com", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }
}
