package com.cargoconnect.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class PartnerBroadcastRequest {
    private Double pickupLatitude;
    private Double pickupLongitude;
    private String pickupAddress;

    @NotNull(message = "Radius is required")
    @Positive(message = "Radius must be positive")
    private Double radiusKm; // e.g. 20.0 KM


    // --- Standard Constructors ---
    public PartnerBroadcastRequest() {}

    public PartnerBroadcastRequest(Double pickupLatitude, Double pickupLongitude, String pickupAddress, Double radiusKm) {
        this.pickupLatitude = pickupLatitude;
        this.pickupLongitude = pickupLongitude;
        this.pickupAddress = pickupAddress;
        this.radiusKm = radiusKm;
    }


    // --- Getters & Setters ---
    public Double getPickupLatitude() { return this.pickupLatitude; }
    public void setPickupLatitude(Double pickupLatitude) { this.pickupLatitude = pickupLatitude; }
    public Double getPickupLongitude() { return this.pickupLongitude; }
    public void setPickupLongitude(Double pickupLongitude) { this.pickupLongitude = pickupLongitude; }
    public String getPickupAddress() { return this.pickupAddress; }
    public void setPickupAddress(String pickupAddress) { this.pickupAddress = pickupAddress; }
    public Double getRadiusKm() { return this.radiusKm; }
    public void setRadiusKm(Double radiusKm) { this.radiusKm = radiusKm; }


    // --- Builder Pattern ---
    public static PartnerBroadcastRequestBuilder builder() {
        return new PartnerBroadcastRequestBuilder();
    }

    public static class PartnerBroadcastRequestBuilder {
        private Double pickupLatitude;
        private Double pickupLongitude;
        private String pickupAddress;
        private Double radiusKm;

        public PartnerBroadcastRequestBuilder() {}

        public PartnerBroadcastRequestBuilder pickupLatitude(Double pickupLatitude) {
            this.pickupLatitude = pickupLatitude;
            return this;
        }

        public PartnerBroadcastRequestBuilder pickupLongitude(Double pickupLongitude) {
            this.pickupLongitude = pickupLongitude;
            return this;
        }

        public PartnerBroadcastRequestBuilder pickupAddress(String pickupAddress) {
            this.pickupAddress = pickupAddress;
            return this;
        }

        public PartnerBroadcastRequestBuilder radiusKm(Double radiusKm) {
            this.radiusKm = radiusKm;
            return this;
        }

        public PartnerBroadcastRequest build() {
            PartnerBroadcastRequest instance = new PartnerBroadcastRequest();
            instance.pickupLatitude = this.pickupLatitude;
            instance.pickupLongitude = this.pickupLongitude;
            instance.pickupAddress = this.pickupAddress;
            instance.radiusKm = this.radiusKm;
            return instance;
        }
    }

}
