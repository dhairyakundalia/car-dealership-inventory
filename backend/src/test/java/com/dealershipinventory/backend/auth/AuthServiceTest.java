package com.dealershipinventory.backend.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.dealershipinventory.backend.auth.dto.AuthResponse;
import com.dealershipinventory.backend.auth.dto.LoginRequest;
import com.dealershipinventory.backend.auth.dto.RegisterRequest;
import com.dealershipinventory.backend.exception.DuplicateResourceException;
import com.dealershipinventory.backend.exception.InvalidCredentialException;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(userRepository, passwordEncoder, jwtService);
    }

    @Test
    void register_WithValidData_ShouldReturnAuthResponse() {
        RegisterRequest request = new RegisterRequest("new@example.com", "password123");
        when(userRepository.findByEmail("new@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password123")).thenReturn("encoded");
        when(jwtService.generateToken("new@example.com")).thenReturn("token");

        AuthResponse response = authService.register(request);

        assertThat(response.email()).isEqualTo("new@example.com");
        assertThat(response.token()).isEqualTo("token");
        assertThat(response.role()).isEqualTo("ROLE_USER");
    }

    @Test
    void register_WithDuplicateEmail_ShouldThrowException() {
        RegisterRequest request = new RegisterRequest("dup@example.com", "password123");
        User existing = User.builder().email("dup@example.com").build();
        when(userRepository.findByEmail("dup@example.com")).thenReturn(Optional.of(existing));

        assertThrows(DuplicateResourceException.class, () -> authService.register(request));
    }

    @Test
    void login_WithValidCredentials_ShouldReturnAuthResponse() {
        LoginRequest request = new LoginRequest("user@example.com", "correctPass");
        User user = User.builder()
            .email("user@example.com")
            .password("encodedPass")
            .role(Role.ROLE_USER)
            .build();
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("correctPass", "encodedPass")).thenReturn(true);
        when(jwtService.generateToken("user@example.com")).thenReturn("jwt-token");

        AuthResponse response = authService.login(request);

        assertThat(response.email()).isEqualTo("user@example.com");
        assertThat(response.token()).isEqualTo("jwt-token");
        assertThat(response.role()).isEqualTo("ROLE_USER");
    }

    @Test
    void login_WithWrongPassword_ShouldThrowException() {
        LoginRequest request = new LoginRequest("user@example.com", "wrongPass");
        User user = User.builder()
            .email("user@example.com")
            .password("encodedPass")
            .role(Role.ROLE_USER)
            .build();
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongPass", "encodedPass")).thenReturn(false);

        assertThrows(InvalidCredentialException.class, () -> authService.login(request));
    }
}
