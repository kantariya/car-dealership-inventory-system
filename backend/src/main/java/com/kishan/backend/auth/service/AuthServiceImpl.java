package com.kishan.backend.auth.service;

import com.kishan.backend.auth.dto.RegisterRequest;
import com.kishan.backend.auth.dto.RegisterResponse;
import com.kishan.backend.auth.entity.Role;
import com.kishan.backend.auth.entity.User;
import com.kishan.backend.auth.exception.EmailAlreadyExistsException;
import com.kishan.backend.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Service implementation for user authentication business logic.
 */
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Registers a new user.
     * Enforces unique email requirements and hashes the password before saving.
     *
     * @param request the registration details
     * @return DTO containing registration results
     */
    @Override
    public RegisterResponse register(RegisterRequest request) {
        // Enforce unique email check
        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyExistsException("Email address already in use: " + request.email());
        }

        // Build user entity with BCrypt-hashed password and default role 'USER'
        User user = User.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .name(request.name())
                .role(Role.USER)
                .build();

        // Persist to database
        User savedUser = userRepository.save(user);
        return mapToResponse(savedUser);
    }

    /**
     * Maps a User entity to a RegisterResponse DTO.
     *
     * @param user the saved user entity
     * @return the mapped response DTO
     */
    private RegisterResponse mapToResponse(User user) {
        return new RegisterResponse(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getRole().name()
        );
    }
}
