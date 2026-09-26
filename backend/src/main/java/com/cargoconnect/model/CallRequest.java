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


    // --- Standard Constructors ---
    public CallRequest() {}

    public CallRequest(Long id, Long customerId, String customerName, Long shipmentId, Reason reason, String preferredTime, String contactPhone, String notes, Status status, String resolvedBy, LocalDateTime resolvedAt, LocalDateTime createdAt) {
        this.id = id;
        this.customerId = customerId;
        this.customerName = customerName;
        this.shipmentId = shipmentId;
        this.reason = reason;
        this.preferredTime = preferredTime;
        this.contactPhone = contactPhone;
        this.notes = notes;
        this.status = status;
        this.resolvedBy = resolvedBy;
        this.resolvedAt = resolvedAt;
        this.createdAt = createdAt;
    }


    // --- Getters & Setters ---
    public Long getId() { return this.id; }
    public void setId(Long id) { this.id = id; }
    public Long getCustomerId() { return this.customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public String getCustomerName() { return this.customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public Long getShipmentId() { return this.shipmentId; }
    public void setShipmentId(Long shipmentId) { this.shipmentId = shipmentId; }
    public Reason getReason() { return this.reason; }
    public void setReason(Reason reason) { this.reason = reason; }
    public String getPreferredTime() { return this.preferredTime; }
    public void setPreferredTime(String preferredTime) { this.preferredTime = preferredTime; }
    public String getContactPhone() { return this.contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
    public String getNotes() { return this.notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public Status getStatus() { return this.status; }
    public void setStatus(Status status) { this.status = status; }
    public String getResolvedBy() { return this.resolvedBy; }
    public void setResolvedBy(String resolvedBy) { this.resolvedBy = resolvedBy; }
    public LocalDateTime getResolvedAt() { return this.resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
    public LocalDateTime getCreatedAt() { return this.createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }


    // --- Builder Pattern ---
    public static CallRequestBuilder builder() {
        return new CallRequestBuilder();
    }

    public static class CallRequestBuilder {
        private Long id;
        private Long customerId;
        private String customerName;
        private Long shipmentId;
        private Reason reason;
        private String preferredTime;
        private String contactPhone;
        private String notes;
        private Status status;
        private String resolvedBy;
        private LocalDateTime resolvedAt;
        private LocalDateTime createdAt;

        public CallRequestBuilder() {}

        public CallRequestBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public CallRequestBuilder customerId(Long customerId) {
            this.customerId = customerId;
            return this;
        }

        public CallRequestBuilder customerName(String customerName) {
            this.customerName = customerName;
            return this;
        }

        public CallRequestBuilder shipmentId(Long shipmentId) {
            this.shipmentId = shipmentId;
            return this;
        }

        public CallRequestBuilder reason(Reason reason) {
            this.reason = reason;
            return this;
        }

        public CallRequestBuilder preferredTime(String preferredTime) {
            this.preferredTime = preferredTime;
            return this;
        }

        public CallRequestBuilder contactPhone(String contactPhone) {
            this.contactPhone = contactPhone;
            return this;
        }

        public CallRequestBuilder notes(String notes) {
            this.notes = notes;
            return this;
        }

        public CallRequestBuilder status(Status status) {
            this.status = status;
            return this;
        }

        public CallRequestBuilder resolvedBy(String resolvedBy) {
            this.resolvedBy = resolvedBy;
            return this;
        }

        public CallRequestBuilder resolvedAt(LocalDateTime resolvedAt) {
            this.resolvedAt = resolvedAt;
            return this;
        }

        public CallRequestBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public CallRequest build() {
            CallRequest instance = new CallRequest();
            instance.id = this.id;
            instance.customerId = this.customerId;
            instance.customerName = this.customerName;
            instance.shipmentId = this.shipmentId;
            instance.reason = this.reason;
            instance.preferredTime = this.preferredTime;
            instance.contactPhone = this.contactPhone;
            instance.notes = this.notes;
            instance.status = this.status;
            instance.resolvedBy = this.resolvedBy;
            instance.resolvedAt = this.resolvedAt;
            instance.createdAt = this.createdAt;
            return instance;
        }
    }

}
