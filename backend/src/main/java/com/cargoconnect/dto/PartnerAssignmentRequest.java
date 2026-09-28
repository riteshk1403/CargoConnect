package com.cargoconnect.dto;

import jakarta.validation.constraints.NotNull;

public class PartnerAssignmentRequest {
    @NotNull(message = "Vehicle ID is required")
    private Long vehicleId;

    @NotNull(message = "Driver ID is required")
    private Long driverId;


    // --- Standard Constructors ---
    public PartnerAssignmentRequest() {}

    public PartnerAssignmentRequest(Long vehicleId, Long driverId) {
        this.vehicleId = vehicleId;
        this.driverId = driverId;
    }


    // --- Getters & Setters ---
    public Long getVehicleId() { return this.vehicleId; }
    public void setVehicleId(Long vehicleId) { this.vehicleId = vehicleId; }
    public Long getDriverId() { return this.driverId; }
    public void setDriverId(Long driverId) { this.driverId = driverId; }


    // --- Builder Pattern ---
    public static PartnerAssignmentRequestBuilder builder() {
        return new PartnerAssignmentRequestBuilder();
    }

    public static class PartnerAssignmentRequestBuilder {
        private Long vehicleId;
        private Long driverId;

        public PartnerAssignmentRequestBuilder() {}

        public PartnerAssignmentRequestBuilder vehicleId(Long vehicleId) {
            this.vehicleId = vehicleId;
            return this;
        }

        public PartnerAssignmentRequestBuilder driverId(Long driverId) {
            this.driverId = driverId;
            return this;
        }

        public PartnerAssignmentRequest build() {
            PartnerAssignmentRequest instance = new PartnerAssignmentRequest();
            instance.vehicleId = this.vehicleId;
            instance.driverId = this.driverId;
            return instance;
        }
    }

}
