package com.dealershipinventory.backend.auth;

public class JwtService {

    public JwtService(String secret, long expirationMs) {
    }

    public String generateToken(String email) {
        throw new UnsupportedOperationException();
    }

    public String extractUsername(String token) {
        throw new UnsupportedOperationException();
    }

    public boolean isTokenValid(String token, String username) {
        throw new UnsupportedOperationException();
    }
}
