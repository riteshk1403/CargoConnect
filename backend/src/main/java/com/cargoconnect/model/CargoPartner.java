package com.cargoconnect.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "cargo_partners")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CargoPartner {
    public enum VerificationStatus {
        PENDING,
        VERIFIED,
        REJECTED
    }

    public enum Status {
        ACTIVE,
        INACTIVE
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String companyName;

    private String ownerName;

    @Column(unique = true, nullable = false)
    private String email;

    private String phone;
    private String address;

    @Builder.Default
    private String city = "Pune";

    @Builder.Default
    private Double latitude = 18.5362; // Default Pune (Pashan area)

    @Builder.Default
    private Double longitude = 73.7929;

    @Builder.Default
    private Double rating = 5.0;

    @Builder.Default
    private int totalTrips = 0;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private VerificationStatus verificationStatus = VerificationStatus.VERIFIED;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Status status = Status.ACTIVE;

    private String rejectionReason;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (updatedAt == null) updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
