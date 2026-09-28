package com.cargoconnect.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class FareQuoteRequest {
    @NotNull(message = "Fare amount is required")
    @Positive(message = "Fare must be positive")
    private Double fare;


    // --- Standard Constructors ---
    public FareQuoteRequest() {}

    public FareQuoteRequest(Double fare) {
        this.fare = fare;
    }


    // --- Getters & Setters ---
    public Double getFare() { return this.fare; }
    public void setFare(Double fare) { this.fare = fare; }


    // --- Builder Pattern ---
    public static FareQuoteRequestBuilder builder() {
        return new FareQuoteRequestBuilder();
    }

    public static class FareQuoteRequestBuilder {
        private Double fare;

        public FareQuoteRequestBuilder() {}

        public FareQuoteRequestBuilder fare(Double fare) {
            this.fare = fare;
            return this;
        }

        public FareQuoteRequest build() {
            FareQuoteRequest instance = new FareQuoteRequest();
            instance.fare = this.fare;
            return instance;
        }
    }

}
