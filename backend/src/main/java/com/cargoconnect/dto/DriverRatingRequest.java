package com.cargoconnect.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DriverRatingRequest {
    @NotNull(message = "Shipment ID is required")
    private Long shipmentId;

    @NotNull(message = "Rating score is required")
    @Min(value = 1, message = "Rating must be at least 1 star")
    @Max(value = 5, message = "Rating cannot exceed 5 stars")
    private Integer rating;

    private String feedback;


    // --- Standard Constructors ---
    public DriverRatingRequest() {}

    public DriverRatingRequest(Long shipmentId, Integer rating, String feedback) {
        this.shipmentId = shipmentId;
        this.rating = rating;
        this.feedback = feedback;
    }


    // --- Getters & Setters ---
    public Long getShipmentId() { return this.shipmentId; }
    public void setShipmentId(Long shipmentId) { this.shipmentId = shipmentId; }
    public Integer getRating() { return this.rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    public String getFeedback() { return this.feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }


    // --- Builder Pattern ---
    public static DriverRatingRequestBuilder builder() {
        return new DriverRatingRequestBuilder();
    }

    public static class DriverRatingRequestBuilder {
        private Long shipmentId;
        private Integer rating;
        private String feedback;

        public DriverRatingRequestBuilder() {}

        public DriverRatingRequestBuilder shipmentId(Long shipmentId) {
            this.shipmentId = shipmentId;
            return this;
        }

        public DriverRatingRequestBuilder rating(Integer rating) {
            this.rating = rating;
            return this;
        }

        public DriverRatingRequestBuilder feedback(String feedback) {
            this.feedback = feedback;
            return this;
        }

        public DriverRatingRequest build() {
            DriverRatingRequest instance = new DriverRatingRequest();
            instance.shipmentId = this.shipmentId;
            instance.rating = this.rating;
            instance.feedback = this.feedback;
            return instance;
        }
    }

}
