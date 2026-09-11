package com.cargoconnect.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentEntity {
    public enum EntityType {
        DRIVER,
        VEHICLE
    }

    public enum DocumentType {
        DRIVING_LICENSE,
        RC,
        INSURANCE,
        FITNESS_CERTIFICATE,
        PERMIT
    }

    public enum Status {
        PENDING,
        VERIFIED,
        REJECTED,
        EXPIRED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EntityType entityType;

    @Column(nullable = false)
    private Long entityId; // driverId or vehicleId

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DocumentType documentType;

    private String fileName;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String fileData; // Stored securely as Base64 data URI or storage path

    private LocalDate expiryDate;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Status status = Status.PENDING;

    private String rejectionReason;

    private LocalDateTime uploadedAt;
    private LocalDateTime verifiedAt;
    private String verifiedBy;

    @PrePersist
    protected void onCreate() {
        if (uploadedAt == null) {
            uploadedAt = LocalDateTime.now();
        }
    }
}
