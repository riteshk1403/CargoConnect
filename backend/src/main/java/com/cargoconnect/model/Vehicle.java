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
}
