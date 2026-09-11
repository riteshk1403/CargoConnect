package com.cargoconnect.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PartnerOfferResponseDto {
    private Long offerId;
    private Long shipmentId;
    private String shipmentNumber;
    private Long cargoPartnerId;
    private String partnerCompanyName;
    private String pickupAddress;
    private String deliveryAddress;
    private String cargoType;
    private Double weight;
    private String vehicleTypeRequired;
    private Double fare;
    private String pickupDate;
    private String pickupTime;
    private Double partnerDistanceKm;
    private String offerStatus; // SENT, ACCEPTED, DECLINED, EXPIRED, CANCELLED
    private Integer acceptancePriority; // 1 = First response, 2 = Second, etc.
    private LocalDateTime notifiedAt;
    private LocalDateTime respondedAt;
}
