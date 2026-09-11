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
}
