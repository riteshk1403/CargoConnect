package com.cargoconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RazorpayOrderResponseDto {
    private Long settlementId;
    private String orderId;
    private Long amountInPaise;
    private Double amountInRupees;
    private String currency;
    private String keyId;
    private String shipmentNumber;
    private String partnerCompanyName;
    private String partnerEmail;
    private String partnerPhone;
    private Boolean isLiveRazorpayOrder;


    // --- Standard Constructors ---
    public RazorpayOrderResponseDto() {}

    public RazorpayOrderResponseDto(Long settlementId, String orderId, Long amountInPaise, Double amountInRupees, String currency, String keyId, String shipmentNumber, String partnerCompanyName, String partnerEmail, String partnerPhone, Boolean isLiveRazorpayOrder) {
        this.settlementId = settlementId;
        this.orderId = orderId;
        this.amountInPaise = amountInPaise;
        this.amountInRupees = amountInRupees;
        this.currency = currency;
        this.keyId = keyId;
        this.shipmentNumber = shipmentNumber;
        this.partnerCompanyName = partnerCompanyName;
        this.partnerEmail = partnerEmail;
        this.partnerPhone = partnerPhone;
        this.isLiveRazorpayOrder = isLiveRazorpayOrder;
    }


    // --- Getters & Setters ---
    public Long getSettlementId() { return this.settlementId; }
    public void setSettlementId(Long settlementId) { this.settlementId = settlementId; }
    public String getOrderId() { return this.orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
    public Long getAmountInPaise() { return this.amountInPaise; }
    public void setAmountInPaise(Long amountInPaise) { this.amountInPaise = amountInPaise; }
    public Double getAmountInRupees() { return this.amountInRupees; }
    public void setAmountInRupees(Double amountInRupees) { this.amountInRupees = amountInRupees; }
    public String getCurrency() { return this.currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getKeyId() { return this.keyId; }
    public void setKeyId(String keyId) { this.keyId = keyId; }
    public String getShipmentNumber() { return this.shipmentNumber; }
    public void setShipmentNumber(String shipmentNumber) { this.shipmentNumber = shipmentNumber; }
    public String getPartnerCompanyName() { return this.partnerCompanyName; }
    public void setPartnerCompanyName(String partnerCompanyName) { this.partnerCompanyName = partnerCompanyName; }
    public String getPartnerEmail() { return this.partnerEmail; }
    public void setPartnerEmail(String partnerEmail) { this.partnerEmail = partnerEmail; }
    public String getPartnerPhone() { return this.partnerPhone; }
    public void setPartnerPhone(String partnerPhone) { this.partnerPhone = partnerPhone; }
    public Boolean isLiveRazorpayOrder() { return this.isLiveRazorpayOrder; }
    public void setIsLiveRazorpayOrder(Boolean isLiveRazorpayOrder) { this.isLiveRazorpayOrder = isLiveRazorpayOrder; }


    // --- Builder Pattern ---
    public static RazorpayOrderResponseDtoBuilder builder() {
        return new RazorpayOrderResponseDtoBuilder();
    }

    public static class RazorpayOrderResponseDtoBuilder {
        private Long settlementId;
        private String orderId;
        private Long amountInPaise;
        private Double amountInRupees;
        private String currency;
        private String keyId;
        private String shipmentNumber;
        private String partnerCompanyName;
        private String partnerEmail;
        private String partnerPhone;
        private Boolean isLiveRazorpayOrder;

        public RazorpayOrderResponseDtoBuilder() {}

        public RazorpayOrderResponseDtoBuilder settlementId(Long settlementId) {
            this.settlementId = settlementId;
            return this;
        }

        public RazorpayOrderResponseDtoBuilder orderId(String orderId) {
            this.orderId = orderId;
            return this;
        }

        public RazorpayOrderResponseDtoBuilder amountInPaise(Long amountInPaise) {
            this.amountInPaise = amountInPaise;
            return this;
        }

        public RazorpayOrderResponseDtoBuilder amountInRupees(Double amountInRupees) {
            this.amountInRupees = amountInRupees;
            return this;
        }

        public RazorpayOrderResponseDtoBuilder currency(String currency) {
            this.currency = currency;
            return this;
        }

        public RazorpayOrderResponseDtoBuilder keyId(String keyId) {
            this.keyId = keyId;
            return this;
        }

        public RazorpayOrderResponseDtoBuilder shipmentNumber(String shipmentNumber) {
            this.shipmentNumber = shipmentNumber;
            return this;
        }

        public RazorpayOrderResponseDtoBuilder partnerCompanyName(String partnerCompanyName) {
            this.partnerCompanyName = partnerCompanyName;
            return this;
        }

        public RazorpayOrderResponseDtoBuilder partnerEmail(String partnerEmail) {
            this.partnerEmail = partnerEmail;
            return this;
        }

        public RazorpayOrderResponseDtoBuilder partnerPhone(String partnerPhone) {
            this.partnerPhone = partnerPhone;
            return this;
        }

        public RazorpayOrderResponseDtoBuilder isLiveRazorpayOrder(Boolean isLiveRazorpayOrder) {
            this.isLiveRazorpayOrder = isLiveRazorpayOrder;
            return this;
        }

        public RazorpayOrderResponseDto build() {
            RazorpayOrderResponseDto instance = new RazorpayOrderResponseDto();
            instance.settlementId = this.settlementId;
            instance.orderId = this.orderId;
            instance.amountInPaise = this.amountInPaise;
            instance.amountInRupees = this.amountInRupees;
            instance.currency = this.currency;
            instance.keyId = this.keyId;
            instance.shipmentNumber = this.shipmentNumber;
            instance.partnerCompanyName = this.partnerCompanyName;
            instance.partnerEmail = this.partnerEmail;
            instance.partnerPhone = this.partnerPhone;
            instance.isLiveRazorpayOrder = this.isLiveRazorpayOrder;
            return instance;
        }
    }

}
