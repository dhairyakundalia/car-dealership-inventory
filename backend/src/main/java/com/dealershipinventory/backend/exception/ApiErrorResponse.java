package com.dealershipinventory.backend.exception;

import java.time.Instant;
import java.util.List;

public record ApiErrorResponse(
    String timestamp,
    int status,
    String error,
    String message,
    List<String> details
) {
    public static ApiErrorResponse of(int status, String error, String message, List<String> details) {
        return new ApiErrorResponse(Instant.now().toString(), status, error, message, details);
    }
}
