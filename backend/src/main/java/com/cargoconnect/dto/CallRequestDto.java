package com.cargoconnect.dto;

import jakarta.validation.constraints.NotBlank;

public class CallRequestDto {
    private Long customerId;
    private Long shipmentId;

    @NotBlank(message = "Reason is required: NEW_SHIPMENT, FARE_DISCUSSION, SHIPMENT_ISSUE, PAYMENT, OTHER")
    private String reason;

    private String preferredTime;
    private String contactPhone;
    private String notes;


    // --- Standard Constructors ---
    public CallRequestDto() {}

    public CallRequestDto(Long customerId, Long shipmentId, String reason, String preferredTime, String contactPhone, String notes) {
        this.customerId = customerId;
        this.shipmentId = shipmentId;
        this.reason = reason;
        this.preferredTime = preferredTime;
        this.contactPhone = contactPhone;
        this.notes = notes;
    }


    // --- Getters & Setters ---
    public Long getCustomerId() { return this.customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public Long getShipmentId() { return this.shipmentId; }
    public void setShipmentId(Long shipmentId) { this.shipmentId = shipmentId; }
    public String getReason() { return this.reason; }
    public void setReason(String reason) { this.reason = reason; }
    public String getPreferredTime() { return this.preferredTime; }
    public void setPreferredTime(String preferredTime) { this.preferredTime = preferredTime; }
    public String getContactPhone() { return this.contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
    public String getNotes() { return this.notes; }
    public void setNotes(String notes) { this.notes = notes; }


    // --- Builder Pattern ---
    public static CallRequestDtoBuilder builder() {
        return new CallRequestDtoBuilder();
    }

    public static class CallRequestDtoBuilder {
        private Long customerId;
        private Long shipmentId;
        private String reason;
        private String preferredTime;
        private String contactPhone;
        private String notes;

        public CallRequestDtoBuilder() {}

        public CallRequestDtoBuilder customerId(Long customerId) {
            this.customerId = customerId;
            return this;
        }

        public CallRequestDtoBuilder shipmentId(Long shipmentId) {
            this.shipmentId = shipmentId;
            return this;
        }

        public CallRequestDtoBuilder reason(String reason) {
            this.reason = reason;
            return this;
        }

        public CallRequestDtoBuilder preferredTime(String preferredTime) {
            this.preferredTime = preferredTime;
            return this;
        }

        public CallRequestDtoBuilder contactPhone(String contactPhone) {
            this.contactPhone = contactPhone;
            return this;
        }

        public CallRequestDtoBuilder notes(String notes) {
            this.notes = notes;
            return this;
        }

        public CallRequestDto build() {
            CallRequestDto instance = new CallRequestDto();
            instance.customerId = this.customerId;
            instance.shipmentId = this.shipmentId;
            instance.reason = this.reason;
            instance.preferredTime = this.preferredTime;
            instance.contactPhone = this.contactPhone;
            instance.notes = this.notes;
            return instance;
        }
    }

}
