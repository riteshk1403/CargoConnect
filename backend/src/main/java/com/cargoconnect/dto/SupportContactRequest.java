package com.cargoconnect.dto;

import jakarta.validation.constraints.NotBlank;

public class SupportContactRequest {
    public Boolean getIsActive() { return this.isActive != null ? this.isActive : false; }

    


    @NotBlank(message = "Support contact label is required (e.g. Primary Support, Secondary Support, Emergency Dispatch)")
    private String label;

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

        private Boolean isActive = true;

        private Integer displayOrder = 0;


    // --- Standard Constructors ---
    public SupportContactRequest() {}

    public SupportContactRequest(String label, String phoneNumber, Boolean isActive, Integer displayOrder) {
        this.label = label;
        this.phoneNumber = phoneNumber;
        this.isActive = isActive;
        this.displayOrder = displayOrder;
    }


    // --- Getters & Setters ---
    public String getLabel() { return this.label; }
    public void setLabel(String label) { this.label = label; }
    public String getPhoneNumber() { return this.phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public Boolean isActive() { return this.isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    public Integer getDisplayOrder() { return this.displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }


    // --- Builder Pattern ---
    public static SupportContactRequestBuilder builder() {
        return new SupportContactRequestBuilder();
    }

    public static class SupportContactRequestBuilder {
        private String label;
        private String phoneNumber;
        private Boolean isActive;
        private Integer displayOrder;

        public SupportContactRequestBuilder() {}

        public SupportContactRequestBuilder label(String label) {
            this.label = label;
            return this;
        }

        public SupportContactRequestBuilder phoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
            return this;
        }

        public SupportContactRequestBuilder isActive(Boolean isActive) {
            this.isActive = isActive;
            return this;
        }

        public SupportContactRequestBuilder displayOrder(Integer displayOrder) {
            this.displayOrder = displayOrder;
            return this;
        }

        public SupportContactRequest build() {
            SupportContactRequest instance = new SupportContactRequest();
            instance.label = this.label;
            instance.phoneNumber = this.phoneNumber;
            instance.isActive = this.isActive;
            instance.displayOrder = this.displayOrder;
            return instance;
        }
    }

}
