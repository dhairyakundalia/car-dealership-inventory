package com.dealershipinventory.backend.exception;

public class InsufficientStockException extends RuntimeException {
    public InsufficientStockException(String vehicleId, int requested, int available) {
        super("Insufficient stock for vehicle " + vehicleId
            + ": requested " + requested + ", available " + available);
    }
}
