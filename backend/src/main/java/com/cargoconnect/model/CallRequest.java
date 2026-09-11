package com.cargoconnect.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "call_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CallRequest {
    public enum Reason {
        NEW_SHIPMENT,
        FARE_DISCUSSION,
        SHIPMENT_ISSUE,
        PAYMENT,
        OTHER
    }

    public enum Status {
        PENDING,
        CALLED,
        RESOLVED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long customerId;
    private String customerName;
    private Long shipmentId;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Reason reason = Reason.NEW_SHIPMENT;

    private String preferredTime;
    private String contactPhone;
    private String notes;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Status status = Status.PENDING;

    private String resolvedBy;
    private LocalDateTime resolvedAt;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }
}
