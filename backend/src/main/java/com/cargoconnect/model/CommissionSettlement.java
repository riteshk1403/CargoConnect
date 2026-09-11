package com.cargoconnect.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "commission_settlements", indexes = {
    @Index(name = "idx_settlement_partner", columnList = "cargo_partner_id"),
    @Index(name = "idx_settlement_shipment", columnList = "shipment_id"),
    @Index(name = "idx_settlement_status", columnList = "payment_status"),
    @Index(name = "idx_settlement_order_id", columnList = "payment_order_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommissionSettlement {

    public enum PaymentStatus {
        PENDING,
        PAYMENT_INITIATED,
        PAID,
        FAILED,
        REFUNDED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "shipment_id", nullable = false)
    private Long shipmentId;

    @Column(name = "shipment_number")
    private String shipmentNumber;

    @Column(name = "cargo_partner_id", nullable = false)
    private Long cargoPartnerId;

    @Column(name = "cargo_partner_name")
    private String cargoPartnerName;

    @Column(name = "shipment_fare", nullable = false)
    private Double shipmentFare;

    @Column(name = "commission_rate", nullable = false)
    private Double commissionRate;

    @Column(name = "commission_amount", nullable = false)
    private Double commissionAmount;

    @Column(name = "partner_amount", nullable = false)
    private Double partnerAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", length = 50, nullable = false)
    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Column(name = "payment_order_id")
    private String paymentOrderId;

    @Column(name = "razorpay_payment_id")
    private String razorpayPaymentId;

    @Column(name = "razorpay_signature")
    private String razorpaySignature;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (paymentStatus == null) {
            paymentStatus = PaymentStatus.PENDING;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
