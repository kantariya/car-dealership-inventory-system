package com.kishan.backend.auth.service;

import com.kishan.backend.auth.dto.RegisterRequest;
import com.kishan.backend.auth.dto.RegisterResponse;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {
    @Override
    public RegisterResponse register(RegisterRequest request) {
        throw new UnsupportedOperationException("Not implemented yet");
    }
}
