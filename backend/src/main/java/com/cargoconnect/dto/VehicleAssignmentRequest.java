package com.cargoconnect.dto;

import jakarta.validation.constraints.NotNull;

public class VehicleAssignmentRequest {
    @NotNull(message = "Vehicle ID is required")
    private Long vehicleId;

    @NotNull(message = "Driver ID is required")
    private Long driverId;


    // --- Standard Constructors ---
    public VehicleAssignmentRequest() {}

    public VehicleAssignmentRequest(Long vehicleId, Long driverId) {
        this.vehicleId = vehicleId;
        this.driverId = driverId;
    }


    // --- Getters & Setters ---
    public Long getVehicleId() { return this.vehicleId; }
    public void setVehicleId(Long vehicleId) { this.vehicleId = vehicleId; }
    public Long getDriverId() { return this.driverId; }
    public void setDriverId(Long driverId) { this.driverId = driverId; }


    // --- Builder Pattern ---
    public static VehicleAssignmentRequestBuilder builder() {
        return new VehicleAssignmentRequestBuilder();
    }

    public static class VehicleAssignmentRequestBuilder {
        private Long vehicleId;
        private Long driverId;

        public VehicleAssignmentRequestBuilder() {}

        public VehicleAssignmentRequestBuilder vehicleId(Long vehicleId) {
            this.vehicleId = vehicleId;
            return this;
        }

        public VehicleAssignmentRequestBuilder driverId(Long driverId) {
            this.driverId = driverId;
            return this;
        }

        public VehicleAssignmentRequest build() {
            VehicleAssignmentRequest instance = new VehicleAssignmentRequest();
            instance.vehicleId = this.vehicleId;
            instance.driverId = this.driverId;
            return instance;
        }
    }

}
