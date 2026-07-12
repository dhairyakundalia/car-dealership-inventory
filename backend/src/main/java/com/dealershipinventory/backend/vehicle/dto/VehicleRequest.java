package com.dealershipinventory.backend.vehicle.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record VehicleRequest(
    @NotBlank String make,
    @NotBlank String model,
    @NotBlank String category,
    @Positive BigDecimal price,
    @Min(0) int quantity
) {
}
