package com.dealershipinventory.backend.auth;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.dealershipinventory.backend.auth.dto.AuthResponse;
import com.dealershipinventory.backend.auth.dto.LoginRequest;
import com.dealershipinventory.backend.auth.dto.RegisterRequest;
import com.dealershipinventory.backend.exception.DuplicateResourceException;
import com.dealershipinventory.backend.exception.InvalidCredentialException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            log.warn("Registration failed: email {} already exists", request.email());
            throw new DuplicateResourceException("Email already registered: " + request.email());
        }

        User user = User.builder()
            .email(request.email())
            .password(passwordEncoder.encode(request.password()))
            .role(Role.ROLE_USER)
            .build();
        userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail());
        log.info("User registered: email={}", user.getEmail());
        return new AuthResponse(token, user.getEmail(), user.getRole().name());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
            .orElseThrow(() -> {
                log.warn("Login failed for email={}", request.email());
                return new InvalidCredentialException("Invalid email or password");
            });

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            log.warn("Login failed for email={}", request.email());
            throw new InvalidCredentialException("Invalid email or password");
        }

        String token = jwtService.generateToken(user.getEmail());
        log.info("User logged in: email={}", user.getEmail());
        return new AuthResponse(token, user.getEmail(), user.getRole().name());
    }
}
