package com.cargoconnect.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "shipments",
       indexes = {
           @Index(name = "idx_shipment_customer", columnList = "customerId"),
           @Index(name = "idx_shipment_partner", columnList = "confirmedPartnerId"),
           @Index(name = "idx_shipment_status", columnList = "status"),
           @Index(name = "idx_shipment_fare_status", columnList = "fareStatus")
       })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Shipment {
    public enum ServiceType {
        NORMAL,
        EXPRESS
    }

    public enum Status {
        PENDING_ASSIGNMENT,
        QUOTED,
        PARTNER_NOTIFIED,
        PARTNER_ACCEPTED,
        ASSIGNED,
        PICKED_UP,
        IN_TRANSIT,
        OUT_FOR_DELIVERY,
        DELIVERED,
        CANCELLED,
        DELIVERY_FAILED,
        DELAYED
    }

    public enum FareStatus {
        PENDING,
        QUOTED,
        ACCEPTED,
        REJECTED,
        NEGOTIATE
    }

    public enum PaymentMethod {
        ONLINE,
        COD,
        CORPORATE_CREDIT
    }

    public enum PaymentStatus {
        PENDING,
        PAID,
        FAILED,
        REFUNDED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String shipmentId; // e.g. "CC-10245"

    @Column(nullable = false)
    private String pickupAddress;

    @Column(nullable = false)
    private String deliveryAddress;

    private Double pickupLatitude;
    private Double pickupLongitude;
    private Double deliveryLatitude;
    private Double deliveryLongitude;

    private Long customerId;
    private Long confirmedPartnerId; // Confirmed Cargo Partner
    private Long assignedVehicleId;   // Selected by Cargo Partner
    private Long assignedDriverId;    // Assigned by Cargo Partner
    private Long driverId;            // Backward-compat alias
    private Long vehicleId;           // Backward-compat alias

    private String goodsType; // Cargo type e.g., Electronics, Industrial Machinery
    private String cargoDescription;

    @Column(nullable = false)
    private Double weight; // kg

    private String vehicleTypeRequired; // e.g., "14 FT Truck", "Tata Ace", "20 FT Container"

    private LocalDate pickupDate;
    private String pickupTime; // e.g. "10:00 AM"

    private LocalDate deliveryDate;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ServiceType serviceType = ServiceType.NORMAL;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Status status = Status.PENDING_ASSIGNMENT;

    // Manual Quotation fields
    private Double fare; // Set manually by CargoConnect Team

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private FareStatus fareStatus = FareStatus.PENDING;

    private String fareSetBy;
    private LocalDateTime fareSetAt;

    // Backward-compat price getter/setter
    public Double getPrice() {
        return fare != null ? fare : 0.0;
    }
    public void setPrice(Double p) {
        this.fare = p;
    }

    // Territory Broadcast fields
    private Double broadcastRadiusKm;
    private LocalDateTime broadcastAt;

    // Partner Confirmation & Locked Commission fields
    private Double commissionRate; // e.g. 10.0%
    private Double commissionAmount; // e.g. 500.0
    private Double partnerAmount; // e.g. 4500.0
    private String commissionSetBy;
    private LocalDateTime commissionSetAt;
    private LocalDateTime confirmedAt;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private PaymentMethod paymentMethod = PaymentMethod.ONLINE;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    private String deliveryOtp; // 4-digit OTP for Proof of Delivery verification

    private String contactName;
    private String contactPhone;
    private String specialRequirements;

    @Column(columnDefinition = "TEXT")
    private String cargoPhotoUrl; // Photo URL or Base64 sample

    @Builder.Default
    private Double cancellationFee = 0.0;

    private String routeCity;
    private String notes;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deliveredAt;

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
