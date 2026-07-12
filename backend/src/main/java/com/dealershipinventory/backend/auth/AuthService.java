package com.dealershipinventory.backend.auth;

import org.springframework.security.crypto.password.PasswordEncoder;

import com.dealershipinventory.backend.auth.dto.AuthResponse;
import com.dealershipinventory.backend.auth.dto.LoginRequest;
import com.dealershipinventory.backend.auth.dto.RegisterRequest;

public class AuthService {

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
    }

    public AuthResponse register(RegisterRequest request) {
        throw new UnsupportedOperationException();
    }

    public AuthResponse login(LoginRequest request) {
        throw new UnsupportedOperationException();
    }
}
