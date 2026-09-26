package com.cargoconnect.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "shipment_partner_offers",
       indexes = {
           @Index(name = "idx_offer_shipment", columnList = "shipmentId"),
           @Index(name = "idx_offer_partner", columnList = "cargoPartnerId")
       })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShipmentPartnerOffer {
    public enum OfferStatus {
        SENT,
        ACCEPTED,
        DECLINED,
        EXPIRED,
        CANCELLED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long shipmentId;

    @Column(nullable = false)
    private Long cargoPartnerId;

    @Builder.Default
    private LocalDateTime notifiedAt = LocalDateTime.now();

    private LocalDateTime respondedAt;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private OfferStatus status = OfferStatus.SENT;

    private Integer acceptancePriority; // 1 for first partner who accepted, 2 for second, etc.

    private Double partnerDistanceKm; // Distance from pickup location at broadcast time

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


    // --- Standard Constructors ---
    public ShipmentPartnerOffer() {}

    public ShipmentPartnerOffer(Long id, Long shipmentId, Long cargoPartnerId, LocalDateTime notifiedAt, LocalDateTime respondedAt, OfferStatus status, Integer acceptancePriority, Double partnerDistanceKm, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.shipmentId = shipmentId;
        this.cargoPartnerId = cargoPartnerId;
        this.notifiedAt = notifiedAt;
        this.respondedAt = respondedAt;
        this.status = status;
        this.acceptancePriority = acceptancePriority;
        this.partnerDistanceKm = partnerDistanceKm;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }


    // --- Getters & Setters ---
    public Long getId() { return this.id; }
    public void setId(Long id) { this.id = id; }
    public Long getShipmentId() { return this.shipmentId; }
    public void setShipmentId(Long shipmentId) { this.shipmentId = shipmentId; }
    public Long getCargoPartnerId() { return this.cargoPartnerId; }
    public void setCargoPartnerId(Long cargoPartnerId) { this.cargoPartnerId = cargoPartnerId; }
    public LocalDateTime getNotifiedAt() { return this.notifiedAt; }
    public void setNotifiedAt(LocalDateTime notifiedAt) { this.notifiedAt = notifiedAt; }
    public LocalDateTime getRespondedAt() { return this.respondedAt; }
    public void setRespondedAt(LocalDateTime respondedAt) { this.respondedAt = respondedAt; }
    public OfferStatus getStatus() { return this.status; }
    public void setStatus(OfferStatus status) { this.status = status; }
    public Integer getAcceptancePriority() { return this.acceptancePriority; }
    public void setAcceptancePriority(Integer acceptancePriority) { this.acceptancePriority = acceptancePriority; }
    public Double getPartnerDistanceKm() { return this.partnerDistanceKm; }
    public void setPartnerDistanceKm(Double partnerDistanceKm) { this.partnerDistanceKm = partnerDistanceKm; }
    public LocalDateTime getCreatedAt() { return this.createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return this.updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }


    // --- Builder Pattern ---
    public static ShipmentPartnerOfferBuilder builder() {
        return new ShipmentPartnerOfferBuilder();
    }

    public static class ShipmentPartnerOfferBuilder {
        private Long id;
        private Long shipmentId;
        private Long cargoPartnerId;
        private LocalDateTime notifiedAt;
        private LocalDateTime respondedAt;
        private OfferStatus status;
        private Integer acceptancePriority;
        private Double partnerDistanceKm;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public ShipmentPartnerOfferBuilder() {}

        public ShipmentPartnerOfferBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public ShipmentPartnerOfferBuilder shipmentId(Long shipmentId) {
            this.shipmentId = shipmentId;
            return this;
        }

        public ShipmentPartnerOfferBuilder cargoPartnerId(Long cargoPartnerId) {
            this.cargoPartnerId = cargoPartnerId;
            return this;
        }

        public ShipmentPartnerOfferBuilder notifiedAt(LocalDateTime notifiedAt) {
            this.notifiedAt = notifiedAt;
            return this;
        }

        public ShipmentPartnerOfferBuilder respondedAt(LocalDateTime respondedAt) {
            this.respondedAt = respondedAt;
            return this;
        }

        public ShipmentPartnerOfferBuilder status(OfferStatus status) {
            this.status = status;
            return this;
        }

        public ShipmentPartnerOfferBuilder acceptancePriority(Integer acceptancePriority) {
            this.acceptancePriority = acceptancePriority;
            return this;
        }

        public ShipmentPartnerOfferBuilder partnerDistanceKm(Double partnerDistanceKm) {
            this.partnerDistanceKm = partnerDistanceKm;
            return this;
        }

        public ShipmentPartnerOfferBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public ShipmentPartnerOfferBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public ShipmentPartnerOffer build() {
            ShipmentPartnerOffer instance = new ShipmentPartnerOffer();
            instance.id = this.id;
            instance.shipmentId = this.shipmentId;
            instance.cargoPartnerId = this.cargoPartnerId;
            instance.notifiedAt = this.notifiedAt;
            instance.respondedAt = this.respondedAt;
            instance.status = this.status;
            instance.acceptancePriority = this.acceptancePriority;
            instance.partnerDistanceKm = this.partnerDistanceKm;
            instance.createdAt = this.createdAt;
            instance.updatedAt = this.updatedAt;
            return instance;
        }
    }

}
