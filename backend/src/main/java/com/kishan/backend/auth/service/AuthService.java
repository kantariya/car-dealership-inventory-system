package com.kishan.backend.auth.service;

import com.kishan.backend.auth.dto.LoginRequest;
import com.kishan.backend.auth.dto.LoginResponse;
import com.kishan.backend.auth.dto.RegisterRequest;
import com.kishan.backend.auth.dto.RegisterResponse;

/**
 * Service interface defining business logic operations related to user authentication and management.
 */
public interface AuthService {
    
    /**
     * Registers a new user in the system.
     * Checks for email duplicates, hashes the password, and persists the user record.
     *
     * @param request the registration details
     * @return the details of the successfully registered user
     * @throws com.kishan.backend.auth.exception.EmailAlreadyExistsException if email is already taken
     */
    RegisterResponse register(RegisterRequest request);

    /**
     * Authenticates a user with email and password and returns a login response.
     *
     * @param request the login request details
     * @return the login response containing the token and user details
     */
    LoginResponse login(LoginRequest request);
}
