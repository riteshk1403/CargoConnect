package com.cargoconnect.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "drivers",
       indexes = {
           @Index(name = "idx_driver_partner", columnList = "cargoPartnerId")
       })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Driver {
    public enum Status {
        AVAILABLE,
        ASSIGNED,
        UNAVAILABLE
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

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String licenseNumber;

    private LocalDate licenseExpiryDate;
    private String phone;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Status status = Status.AVAILABLE;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private VerificationStatus verificationStatus = VerificationStatus.VERIFIED;

    private String rejectionReason;

    @Builder.Default
    private Double latitude = 18.5362;

    @Builder.Default
    private Double longitude = 73.7929;

    private String activeShipmentId;

    @Builder.Default
    private Double rating = 5.0;

    @Builder.Default
    private int totalRatings = 0;

    @Builder.Default
    private int totalDeliveries = 0;
}
