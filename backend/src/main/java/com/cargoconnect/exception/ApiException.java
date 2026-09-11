package com.cargoconnect.exception;

public class ApiException extends RuntimeException {
    public ApiException(String message) {
        super(message);
    }
}
