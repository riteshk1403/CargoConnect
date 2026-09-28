package com.cargoconnect.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class SupportSettingRequest {

    @NotBlank(message = "Primary support phone number is required")
    private String primaryPhone;

    @NotBlank(message = "Secondary support phone number is required")
    private String secondaryPhone;

    @NotBlank(message = "Support email is required")
    @Email(message = "Please provide a valid support email address")
    private String supportEmail;

        private Boolean primaryActive = true;

        private Boolean secondaryActive = true;


    // --- Standard Constructors ---
    public SupportSettingRequest() {}

    public SupportSettingRequest(String primaryPhone, String secondaryPhone, String supportEmail, Boolean primaryActive, Boolean secondaryActive) {
        this.primaryPhone = primaryPhone;
        this.secondaryPhone = secondaryPhone;
        this.supportEmail = supportEmail;
        this.primaryActive = primaryActive;
        this.secondaryActive = secondaryActive;
    }


    // --- Getters & Setters ---
    public String getPrimaryPhone() { return this.primaryPhone; }
    public void setPrimaryPhone(String primaryPhone) { this.primaryPhone = primaryPhone; }
    public String getSecondaryPhone() { return this.secondaryPhone; }
    public void setSecondaryPhone(String secondaryPhone) { this.secondaryPhone = secondaryPhone; }
    public String getSupportEmail() { return this.supportEmail; }
    public void setSupportEmail(String supportEmail) { this.supportEmail = supportEmail; }
    public Boolean getPrimaryActive() { return this.primaryActive; }
    public void setPrimaryActive(Boolean primaryActive) { this.primaryActive = primaryActive; }
    public Boolean getSecondaryActive() { return this.secondaryActive; }
    public void setSecondaryActive(Boolean secondaryActive) { this.secondaryActive = secondaryActive; }


    // --- Builder Pattern ---
    public static SupportSettingRequestBuilder builder() {
        return new SupportSettingRequestBuilder();
    }

    public static class SupportSettingRequestBuilder {
        private String primaryPhone;
        private String secondaryPhone;
        private String supportEmail;
        private Boolean primaryActive;
        private Boolean secondaryActive;

        public SupportSettingRequestBuilder() {}

        public SupportSettingRequestBuilder primaryPhone(String primaryPhone) {
            this.primaryPhone = primaryPhone;
            return this;
        }

        public SupportSettingRequestBuilder secondaryPhone(String secondaryPhone) {
            this.secondaryPhone = secondaryPhone;
            return this;
        }

        public SupportSettingRequestBuilder supportEmail(String supportEmail) {
            this.supportEmail = supportEmail;
            return this;
        }

        public SupportSettingRequestBuilder primaryActive(Boolean primaryActive) {
            this.primaryActive = primaryActive;
            return this;
        }

        public SupportSettingRequestBuilder secondaryActive(Boolean secondaryActive) {
            this.secondaryActive = secondaryActive;
            return this;
        }

        public SupportSettingRequest build() {
            SupportSettingRequest instance = new SupportSettingRequest();
            instance.primaryPhone = this.primaryPhone;
            instance.secondaryPhone = this.secondaryPhone;
            instance.supportEmail = this.supportEmail;
            instance.primaryActive = this.primaryActive;
            instance.secondaryActive = this.secondaryActive;
            return instance;
        }
    }

}
