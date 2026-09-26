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


    // --- Standard Constructors ---
    public Complaint() {}

    public Complaint(Long id, String complaintId, Long customerId, Long shipmentId, Type type, String description, Status status, String actionTaken, Double refundAmount, LocalDateTime createdAt, LocalDateTime resolvedAt) {
        this.id = id;
        this.complaintId = complaintId;
        this.customerId = customerId;
        this.shipmentId = shipmentId;
        this.type = type;
        this.description = description;
        this.status = status;
        this.actionTaken = actionTaken;
        this.refundAmount = refundAmount;
        this.createdAt = createdAt;
        this.resolvedAt = resolvedAt;
    }


    // --- Getters & Setters ---
    public Long getId() { return this.id; }
    public void setId(Long id) { this.id = id; }
    public String getComplaintId() { return this.complaintId; }
    public void setComplaintId(String complaintId) { this.complaintId = complaintId; }
    public Long getCustomerId() { return this.customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public Long getShipmentId() { return this.shipmentId; }
    public void setShipmentId(Long shipmentId) { this.shipmentId = shipmentId; }
    public Type getType() { return this.type; }
    public void setType(Type type) { this.type = type; }
    public String getDescription() { return this.description; }
    public void setDescription(String description) { this.description = description; }
    public Status getStatus() { return this.status; }
    public void setStatus(Status status) { this.status = status; }
    public String getActionTaken() { return this.actionTaken; }
    public void setActionTaken(String actionTaken) { this.actionTaken = actionTaken; }
    public Double getRefundAmount() { return this.refundAmount; }
    public void setRefundAmount(Double refundAmount) { this.refundAmount = refundAmount; }
    public LocalDateTime getCreatedAt() { return this.createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getResolvedAt() { return this.resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }


    // --- Builder Pattern ---
    public static ComplaintBuilder builder() {
        return new ComplaintBuilder();
    }

    public static class ComplaintBuilder {
        private Long id;
        private String complaintId;
        private Long customerId;
        private Long shipmentId;
        private Type type;
        private String description;
        private Status status;
        private String actionTaken;
        private Double refundAmount;
        private LocalDateTime createdAt;
        private LocalDateTime resolvedAt;

        public ComplaintBuilder() {}

        public ComplaintBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public ComplaintBuilder complaintId(String complaintId) {
            this.complaintId = complaintId;
            return this;
        }

        public ComplaintBuilder customerId(Long customerId) {
            this.customerId = customerId;
            return this;
        }

        public ComplaintBuilder shipmentId(Long shipmentId) {
            this.shipmentId = shipmentId;
            return this;
        }

        public ComplaintBuilder type(Type type) {
            this.type = type;
            return this;
        }

        public ComplaintBuilder description(String description) {
            this.description = description;
            return this;
        }

        public ComplaintBuilder status(Status status) {
            this.status = status;
            return this;
        }

        public ComplaintBuilder actionTaken(String actionTaken) {
            this.actionTaken = actionTaken;
            return this;
        }

        public ComplaintBuilder refundAmount(Double refundAmount) {
            this.refundAmount = refundAmount;
            return this;
        }

        public ComplaintBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public ComplaintBuilder resolvedAt(LocalDateTime resolvedAt) {
            this.resolvedAt = resolvedAt;
            return this;
        }

        public Complaint build() {
            Complaint instance = new Complaint();
            instance.id = this.id;
            instance.complaintId = this.complaintId;
            instance.customerId = this.customerId;
            instance.shipmentId = this.shipmentId;
            instance.type = this.type;
            instance.description = this.description;
            instance.status = this.status;
            instance.actionTaken = this.actionTaken;
            instance.refundAmount = this.refundAmount;
            instance.createdAt = this.createdAt;
            instance.resolvedAt = this.resolvedAt;
            return instance;
        }
    }

}
