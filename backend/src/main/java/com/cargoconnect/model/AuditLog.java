package com.cargoconnect.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String userRole;

    @Column(nullable = false)
    private String action; // e.g. "VEHICLE_ASSIGNED", "DRIVER_VERIFIED", "BREAKDOWN_RECORDED"

    private String entityType; // e.g. "SHIPMENT", "VEHICLE", "DRIVER", "DOCUMENT"
    private String entityId;

    @Column(columnDefinition = "TEXT")
    private String details;

    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        if (timestamp == null) timestamp = LocalDateTime.now();
    }
}
