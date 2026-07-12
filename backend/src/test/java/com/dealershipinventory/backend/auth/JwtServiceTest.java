package com.dealershipinventory.backend.auth;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class JwtServiceTest {

    private JwtService jwtService;

    private static final String SECRET = "my-test-secret-key-that-is-at-least-256-bits-long";
    private static final long EXPIRATION = 3600000;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService(SECRET, EXPIRATION);
    }

    @Test
    void generateToken_ShouldCreateNonNullToken() {
        String token = jwtService.generateToken("test@example.com");
        assertThat(token).isNotBlank();
    }

    @Test
    void extractUsername_ShouldMatchOriginal() {
        String email = "user@example.com";
        String token = jwtService.generateToken(email);
        assertThat(jwtService.extractUsername(token)).isEqualTo(email);
    }

    @Test
    void isTokenValid_WithCorrectUser_ShouldReturnTrue() {
        String email = "valid@example.com";
        String token = jwtService.generateToken(email);
        assertThat(jwtService.isTokenValid(token, email)).isTrue();
    }

    @Test
    void isTokenValid_WithExpiredToken_ShouldReturnFalse() {
        JwtService shortExpiryJwt = new JwtService(SECRET, -1000);
        String email = "expired@example.com";
        String token = shortExpiryJwt.generateToken(email);
        assertThat(shortExpiryJwt.isTokenValid(token, email)).isFalse();
    }
}
