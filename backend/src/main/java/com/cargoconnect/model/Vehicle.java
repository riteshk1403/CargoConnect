package com.cargoconnect.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vehicles",
       indexes = {
           @Index(name = "idx_vehicle_partner", columnList = "cargoPartnerId")
       })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vehicle {
    public enum Status {
        AVAILABLE,
        ASSIGNED,
        IN_TRANSIT,
        UNDER_MAINTENANCE,
        OUT_OF_SERVICE
    }

    public enum VerificationStatus {
        PENDING,
        VERIFIED,
        REJECTED,
        EXPIRED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long cargoPartnerId; // Linked Cargo Partner

    @Column(unique = true, nullable = false)
    private String vehicleNumber;

    private String type; // e.g., Tata Ace, 14 FT Truck, 19 FT Container, Pickup Van, Trailer

    @Builder.Default
    private Double capacity = 0.0; // total weight capacity in kg

    @Builder.Default
    private Double usedCapacity = 0.0;

    @Builder.Default
    private Double latitude = 18.5362;

    @Builder.Default
    private Double longitude = 73.7929;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Status status = Status.AVAILABLE;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private VerificationStatus verificationStatus = VerificationStatus.VERIFIED;

    private String rejectionReason;

    public Double getRemainingCapacity() {
        double cap = this.capacity != null ? this.capacity : 0.0;
        double used = this.usedCapacity != null ? this.usedCapacity : 0.0;
        return Math.max(0.0, cap - used);
    }


    // --- Standard Constructors ---
    public Vehicle() {}

    public Vehicle(Long id, Long cargoPartnerId, String vehicleNumber, String type, Double capacity, Double usedCapacity, Double latitude, Double longitude, Status status, VerificationStatus verificationStatus, String rejectionReason) {
        this.id = id;
        this.cargoPartnerId = cargoPartnerId;
        this.vehicleNumber = vehicleNumber;
        this.type = type;
        this.capacity = capacity;
        this.usedCapacity = usedCapacity;
        this.latitude = latitude;
        this.longitude = longitude;
        this.status = status;
        this.verificationStatus = verificationStatus;
        this.rejectionReason = rejectionReason;
    }


    // --- Getters & Setters ---
    public Long getId() { return this.id; }
    public void setId(Long id) { this.id = id; }
    public Long getCargoPartnerId() { return this.cargoPartnerId; }
    public void setCargoPartnerId(Long cargoPartnerId) { this.cargoPartnerId = cargoPartnerId; }
    public String getVehicleNumber() { return this.vehicleNumber; }
    public void setVehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; }
    public String getType() { return this.type; }
    public void setType(String type) { this.type = type; }
    public Double getCapacity() { return this.capacity; }
    public void setCapacity(Double capacity) { this.capacity = capacity; }
    public Double getUsedCapacity() { return this.usedCapacity; }
    public void setUsedCapacity(Double usedCapacity) { this.usedCapacity = usedCapacity; }
    public Double getLatitude() { return this.latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return this.longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public Status getStatus() { return this.status; }
    public void setStatus(Status status) { this.status = status; }
    public VerificationStatus getVerificationStatus() { return this.verificationStatus; }
    public void setVerificationStatus(VerificationStatus verificationStatus) { this.verificationStatus = verificationStatus; }
    public String getRejectionReason() { return this.rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }


    // --- Builder Pattern ---
    public static VehicleBuilder builder() {
        return new VehicleBuilder();
    }

    public static class VehicleBuilder {
        private Long id;
        private Long cargoPartnerId;
        private String vehicleNumber;
        private String type;
        private Double capacity;
        private Double usedCapacity;
        private Double latitude;
        private Double longitude;
        private Status status;
        private VerificationStatus verificationStatus;
        private String rejectionReason;

        public VehicleBuilder() {}

        public VehicleBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public VehicleBuilder cargoPartnerId(Long cargoPartnerId) {
            this.cargoPartnerId = cargoPartnerId;
            return this;
        }

        public VehicleBuilder vehicleNumber(String vehicleNumber) {
            this.vehicleNumber = vehicleNumber;
            return this;
        }

        public VehicleBuilder type(String type) {
            this.type = type;
            return this;
        }

        public VehicleBuilder capacity(Double capacity) {
            this.capacity = capacity;
            return this;
        }

        public VehicleBuilder usedCapacity(Double usedCapacity) {
            this.usedCapacity = usedCapacity;
            return this;
        }

        public VehicleBuilder latitude(Double latitude) {
            this.latitude = latitude;
            return this;
        }

        public VehicleBuilder longitude(Double longitude) {
            this.longitude = longitude;
            return this;
        }

        public VehicleBuilder status(Status status) {
            this.status = status;
            return this;
        }

        public VehicleBuilder verificationStatus(VerificationStatus verificationStatus) {
            this.verificationStatus = verificationStatus;
            return this;
        }

        public VehicleBuilder rejectionReason(String rejectionReason) {
            this.rejectionReason = rejectionReason;
            return this;
        }

        public Vehicle build() {
            Vehicle instance = new Vehicle();
            instance.id = this.id;
            instance.cargoPartnerId = this.cargoPartnerId;
            instance.vehicleNumber = this.vehicleNumber;
            instance.type = this.type;
            instance.capacity = this.capacity;
            instance.usedCapacity = this.usedCapacity;
            instance.latitude = this.latitude;
            instance.longitude = this.longitude;
            instance.status = this.status;
            instance.verificationStatus = this.verificationStatus;
            instance.rejectionReason = this.rejectionReason;
            return instance;
        }
    }

}
