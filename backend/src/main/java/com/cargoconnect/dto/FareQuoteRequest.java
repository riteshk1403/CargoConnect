package com.cargoconnect.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class FareQuoteRequest {
    @NotNull(message = "Fare amount is required")
    @Positive(message = "Fare must be positive")
    private Double fare;
}
