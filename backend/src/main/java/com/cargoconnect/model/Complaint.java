package com.cargoconnect.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "complaints")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Complaint {
    public enum Type {
        LATE_DELIVERY,
        DAMAGED_GOODS,
        MISSING_ITEMS,
        WRONG_DELIVERY,
        DRIVER_MISCONDUCT
    }

    public enum Status {
        PENDING,
        IN_REVIEW,
        RESOLVED,
        REJECTED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String complaintId;

    private Long customerId;
    private Long shipmentId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Type type;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Status status = Status.PENDING;

    private String actionTaken;

    @Builder.Default
    private Double refundAmount = 0.0;

    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }
}
