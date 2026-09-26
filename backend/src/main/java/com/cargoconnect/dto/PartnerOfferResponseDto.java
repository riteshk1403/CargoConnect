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


    // --- Standard Constructors ---
    public PartnerOfferResponseDto() {}

    public PartnerOfferResponseDto(Long offerId, Long shipmentId, String shipmentNumber, Long cargoPartnerId, String partnerCompanyName, String pickupAddress, String deliveryAddress, String cargoType, Double weight, String vehicleTypeRequired, Double fare, String pickupDate, String pickupTime, Double partnerDistanceKm, String offerStatus, Integer acceptancePriority, LocalDateTime notifiedAt, LocalDateTime respondedAt) {
        this.offerId = offerId;
        this.shipmentId = shipmentId;
        this.shipmentNumber = shipmentNumber;
        this.cargoPartnerId = cargoPartnerId;
        this.partnerCompanyName = partnerCompanyName;
        this.pickupAddress = pickupAddress;
        this.deliveryAddress = deliveryAddress;
        this.cargoType = cargoType;
        this.weight = weight;
        this.vehicleTypeRequired = vehicleTypeRequired;
        this.fare = fare;
        this.pickupDate = pickupDate;
        this.pickupTime = pickupTime;
        this.partnerDistanceKm = partnerDistanceKm;
        this.offerStatus = offerStatus;
        this.acceptancePriority = acceptancePriority;
        this.notifiedAt = notifiedAt;
        this.respondedAt = respondedAt;
    }


    // --- Getters & Setters ---
    public Long getOfferId() { return this.offerId; }
    public void setOfferId(Long offerId) { this.offerId = offerId; }
    public Long getShipmentId() { return this.shipmentId; }
    public void setShipmentId(Long shipmentId) { this.shipmentId = shipmentId; }
    public String getShipmentNumber() { return this.shipmentNumber; }
    public void setShipmentNumber(String shipmentNumber) { this.shipmentNumber = shipmentNumber; }
    public Long getCargoPartnerId() { return this.cargoPartnerId; }
    public void setCargoPartnerId(Long cargoPartnerId) { this.cargoPartnerId = cargoPartnerId; }
    public String getPartnerCompanyName() { return this.partnerCompanyName; }
    public void setPartnerCompanyName(String partnerCompanyName) { this.partnerCompanyName = partnerCompanyName; }
    public String getPickupAddress() { return this.pickupAddress; }
    public void setPickupAddress(String pickupAddress) { this.pickupAddress = pickupAddress; }
    public String getDeliveryAddress() { return this.deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }
    public String getCargoType() { return this.cargoType; }
    public void setCargoType(String cargoType) { this.cargoType = cargoType; }
    public Double getWeight() { return this.weight; }
    public void setWeight(Double weight) { this.weight = weight; }
    public String getVehicleTypeRequired() { return this.vehicleTypeRequired; }
    public void setVehicleTypeRequired(String vehicleTypeRequired) { this.vehicleTypeRequired = vehicleTypeRequired; }
    public Double getFare() { return this.fare; }
    public void setFare(Double fare) { this.fare = fare; }
    public String getPickupDate() { return this.pickupDate; }
    public void setPickupDate(String pickupDate) { this.pickupDate = pickupDate; }
    public String getPickupTime() { return this.pickupTime; }
    public void setPickupTime(String pickupTime) { this.pickupTime = pickupTime; }
    public Double getPartnerDistanceKm() { return this.partnerDistanceKm; }
    public void setPartnerDistanceKm(Double partnerDistanceKm) { this.partnerDistanceKm = partnerDistanceKm; }
    public String getOfferStatus() { return this.offerStatus; }
    public void setOfferStatus(String offerStatus) { this.offerStatus = offerStatus; }
    public Integer getAcceptancePriority() { return this.acceptancePriority; }
    public void setAcceptancePriority(Integer acceptancePriority) { this.acceptancePriority = acceptancePriority; }
    public LocalDateTime getNotifiedAt() { return this.notifiedAt; }
    public void setNotifiedAt(LocalDateTime notifiedAt) { this.notifiedAt = notifiedAt; }
    public LocalDateTime getRespondedAt() { return this.respondedAt; }
    public void setRespondedAt(LocalDateTime respondedAt) { this.respondedAt = respondedAt; }


    // --- Builder Pattern ---
    public static PartnerOfferResponseDtoBuilder builder() {
        return new PartnerOfferResponseDtoBuilder();
    }

    public static class PartnerOfferResponseDtoBuilder {
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
        private String offerStatus;
        private Integer acceptancePriority;
        private LocalDateTime notifiedAt;
        private LocalDateTime respondedAt;

        public PartnerOfferResponseDtoBuilder() {}

        public PartnerOfferResponseDtoBuilder offerId(Long offerId) {
            this.offerId = offerId;
            return this;
        }

        public PartnerOfferResponseDtoBuilder shipmentId(Long shipmentId) {
            this.shipmentId = shipmentId;
            return this;
        }

        public PartnerOfferResponseDtoBuilder shipmentNumber(String shipmentNumber) {
            this.shipmentNumber = shipmentNumber;
            return this;
        }

        public PartnerOfferResponseDtoBuilder cargoPartnerId(Long cargoPartnerId) {
            this.cargoPartnerId = cargoPartnerId;
            return this;
        }

        public PartnerOfferResponseDtoBuilder partnerCompanyName(String partnerCompanyName) {
            this.partnerCompanyName = partnerCompanyName;
            return this;
        }

        public PartnerOfferResponseDtoBuilder pickupAddress(String pickupAddress) {
            this.pickupAddress = pickupAddress;
            return this;
        }

        public PartnerOfferResponseDtoBuilder deliveryAddress(String deliveryAddress) {
            this.deliveryAddress = deliveryAddress;
            return this;
        }

        public PartnerOfferResponseDtoBuilder cargoType(String cargoType) {
            this.cargoType = cargoType;
            return this;
        }

        public PartnerOfferResponseDtoBuilder weight(Double weight) {
            this.weight = weight;
            return this;
        }

        public PartnerOfferResponseDtoBuilder vehicleTypeRequired(String vehicleTypeRequired) {
            this.vehicleTypeRequired = vehicleTypeRequired;
            return this;
        }

        public PartnerOfferResponseDtoBuilder fare(Double fare) {
            this.fare = fare;
            return this;
        }

        public PartnerOfferResponseDtoBuilder pickupDate(String pickupDate) {
            this.pickupDate = pickupDate;
            return this;
        }

        public PartnerOfferResponseDtoBuilder pickupTime(String pickupTime) {
            this.pickupTime = pickupTime;
            return this;
        }

        public PartnerOfferResponseDtoBuilder partnerDistanceKm(Double partnerDistanceKm) {
            this.partnerDistanceKm = partnerDistanceKm;
            return this;
        }

        public PartnerOfferResponseDtoBuilder offerStatus(String offerStatus) {
            this.offerStatus = offerStatus;
            return this;
        }

        public PartnerOfferResponseDtoBuilder acceptancePriority(Integer acceptancePriority) {
            this.acceptancePriority = acceptancePriority;
            return this;
        }

        public PartnerOfferResponseDtoBuilder notifiedAt(LocalDateTime notifiedAt) {
            this.notifiedAt = notifiedAt;
            return this;
        }

        public PartnerOfferResponseDtoBuilder respondedAt(LocalDateTime respondedAt) {
            this.respondedAt = respondedAt;
            return this;
        }

        public PartnerOfferResponseDto build() {
            PartnerOfferResponseDto instance = new PartnerOfferResponseDto();
            instance.offerId = this.offerId;
            instance.shipmentId = this.shipmentId;
            instance.shipmentNumber = this.shipmentNumber;
            instance.cargoPartnerId = this.cargoPartnerId;
            instance.partnerCompanyName = this.partnerCompanyName;
            instance.pickupAddress = this.pickupAddress;
            instance.deliveryAddress = this.deliveryAddress;
            instance.cargoType = this.cargoType;
            instance.weight = this.weight;
            instance.vehicleTypeRequired = this.vehicleTypeRequired;
            instance.fare = this.fare;
            instance.pickupDate = this.pickupDate;
            instance.pickupTime = this.pickupTime;
            instance.partnerDistanceKm = this.partnerDistanceKm;
            instance.offerStatus = this.offerStatus;
            instance.acceptancePriority = this.acceptancePriority;
            instance.notifiedAt = this.notifiedAt;
            instance.respondedAt = this.respondedAt;
            return instance;
        }
    }

}
