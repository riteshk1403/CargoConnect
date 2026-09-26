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


    // --- Standard Constructors ---
    public CommissionSettlement() {}

    public CommissionSettlement(Long id, Long shipmentId, String shipmentNumber, Long cargoPartnerId, String cargoPartnerName, Double shipmentFare, Double commissionRate, Double commissionAmount, Double partnerAmount, PaymentStatus paymentStatus, String paymentOrderId, String razorpayPaymentId, String razorpaySignature, LocalDateTime paidAt, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.shipmentId = shipmentId;
        this.shipmentNumber = shipmentNumber;
        this.cargoPartnerId = cargoPartnerId;
        this.cargoPartnerName = cargoPartnerName;
        this.shipmentFare = shipmentFare;
        this.commissionRate = commissionRate;
        this.commissionAmount = commissionAmount;
        this.partnerAmount = partnerAmount;
        this.paymentStatus = paymentStatus;
        this.paymentOrderId = paymentOrderId;
        this.razorpayPaymentId = razorpayPaymentId;
        this.razorpaySignature = razorpaySignature;
        this.paidAt = paidAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }


    // --- Getters & Setters ---
    public Long getId() { return this.id; }
    public void setId(Long id) { this.id = id; }
    public Long getShipmentId() { return this.shipmentId; }
    public void setShipmentId(Long shipmentId) { this.shipmentId = shipmentId; }
    public String getShipmentNumber() { return this.shipmentNumber; }
    public void setShipmentNumber(String shipmentNumber) { this.shipmentNumber = shipmentNumber; }
    public Long getCargoPartnerId() { return this.cargoPartnerId; }
    public void setCargoPartnerId(Long cargoPartnerId) { this.cargoPartnerId = cargoPartnerId; }
    public String getCargoPartnerName() { return this.cargoPartnerName; }
    public void setCargoPartnerName(String cargoPartnerName) { this.cargoPartnerName = cargoPartnerName; }
    public Double getShipmentFare() { return this.shipmentFare; }
    public void setShipmentFare(Double shipmentFare) { this.shipmentFare = shipmentFare; }
    public Double getCommissionRate() { return this.commissionRate; }
    public void setCommissionRate(Double commissionRate) { this.commissionRate = commissionRate; }
    public Double getCommissionAmount() { return this.commissionAmount; }
    public void setCommissionAmount(Double commissionAmount) { this.commissionAmount = commissionAmount; }
    public Double getPartnerAmount() { return this.partnerAmount; }
    public void setPartnerAmount(Double partnerAmount) { this.partnerAmount = partnerAmount; }
    public PaymentStatus getPaymentStatus() { return this.paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }
    public String getPaymentOrderId() { return this.paymentOrderId; }
    public void setPaymentOrderId(String paymentOrderId) { this.paymentOrderId = paymentOrderId; }
    public String getRazorpayPaymentId() { return this.razorpayPaymentId; }
    public void setRazorpayPaymentId(String razorpayPaymentId) { this.razorpayPaymentId = razorpayPaymentId; }
    public String getRazorpaySignature() { return this.razorpaySignature; }
    public void setRazorpaySignature(String razorpaySignature) { this.razorpaySignature = razorpaySignature; }
    public LocalDateTime getPaidAt() { return this.paidAt; }
    public void setPaidAt(LocalDateTime paidAt) { this.paidAt = paidAt; }
    public LocalDateTime getCreatedAt() { return this.createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return this.updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }


    // --- Builder Pattern ---
    public static CommissionSettlementBuilder builder() {
        return new CommissionSettlementBuilder();
    }

    public static class CommissionSettlementBuilder {
        private Long id;
        private Long shipmentId;
        private String shipmentNumber;
        private Long cargoPartnerId;
        private String cargoPartnerName;
        private Double shipmentFare;
        private Double commissionRate;
        private Double commissionAmount;
        private Double partnerAmount;
        private PaymentStatus paymentStatus;
        private String paymentOrderId;
        private String razorpayPaymentId;
        private String razorpaySignature;
        private LocalDateTime paidAt;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public CommissionSettlementBuilder() {}

        public CommissionSettlementBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public CommissionSettlementBuilder shipmentId(Long shipmentId) {
            this.shipmentId = shipmentId;
            return this;
        }

        public CommissionSettlementBuilder shipmentNumber(String shipmentNumber) {
            this.shipmentNumber = shipmentNumber;
            return this;
        }

        public CommissionSettlementBuilder cargoPartnerId(Long cargoPartnerId) {
            this.cargoPartnerId = cargoPartnerId;
            return this;
        }

        public CommissionSettlementBuilder cargoPartnerName(String cargoPartnerName) {
            this.cargoPartnerName = cargoPartnerName;
            return this;
        }

        public CommissionSettlementBuilder shipmentFare(Double shipmentFare) {
            this.shipmentFare = shipmentFare;
            return this;
        }

        public CommissionSettlementBuilder commissionRate(Double commissionRate) {
            this.commissionRate = commissionRate;
            return this;
        }

        public CommissionSettlementBuilder commissionAmount(Double commissionAmount) {
            this.commissionAmount = commissionAmount;
            return this;
        }

        public CommissionSettlementBuilder partnerAmount(Double partnerAmount) {
            this.partnerAmount = partnerAmount;
            return this;
        }

        public CommissionSettlementBuilder paymentStatus(PaymentStatus paymentStatus) {
            this.paymentStatus = paymentStatus;
            return this;
        }

        public CommissionSettlementBuilder paymentOrderId(String paymentOrderId) {
            this.paymentOrderId = paymentOrderId;
            return this;
        }

        public CommissionSettlementBuilder razorpayPaymentId(String razorpayPaymentId) {
            this.razorpayPaymentId = razorpayPaymentId;
            return this;
        }

        public CommissionSettlementBuilder razorpaySignature(String razorpaySignature) {
            this.razorpaySignature = razorpaySignature;
            return this;
        }

        public CommissionSettlementBuilder paidAt(LocalDateTime paidAt) {
            this.paidAt = paidAt;
            return this;
        }

        public CommissionSettlementBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public CommissionSettlementBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public CommissionSettlement build() {
            CommissionSettlement instance = new CommissionSettlement();
            instance.id = this.id;
            instance.shipmentId = this.shipmentId;
            instance.shipmentNumber = this.shipmentNumber;
            instance.cargoPartnerId = this.cargoPartnerId;
            instance.cargoPartnerName = this.cargoPartnerName;
            instance.shipmentFare = this.shipmentFare;
            instance.commissionRate = this.commissionRate;
            instance.commissionAmount = this.commissionAmount;
            instance.partnerAmount = this.partnerAmount;
            instance.paymentStatus = this.paymentStatus;
            instance.paymentOrderId = this.paymentOrderId;
            instance.razorpayPaymentId = this.razorpayPaymentId;
            instance.razorpaySignature = this.razorpaySignature;
            instance.paidAt = this.paidAt;
            instance.createdAt = this.createdAt;
            instance.updatedAt = this.updatedAt;
            return instance;
        }
    }

}
