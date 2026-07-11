package com.kishan.backend.vehicle.exception;

/**
 * Exception thrown when a vehicle purchase request is made but the vehicle is out of stock.
 */
public class OutOfStockException extends RuntimeException {
    /**
     * Constructs a new OutOfStockException with the specified detail message.
     *
     * @param message the detail message
     */
    public OutOfStockException(String message) {
        super(message);
    }
}
