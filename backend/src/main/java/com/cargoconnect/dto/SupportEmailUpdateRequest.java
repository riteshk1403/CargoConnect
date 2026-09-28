package com.cargoconnect.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class SupportEmailUpdateRequest {

    @NotBlank(message = "Support email is required")
    @Email(message = "Please provide a valid support email address")
    private String supportEmail;


    // --- Standard Constructors ---
    public SupportEmailUpdateRequest() {}

    public SupportEmailUpdateRequest(String supportEmail) {
        this.supportEmail = supportEmail;
    }


    // --- Getters & Setters ---
    public String getSupportEmail() { return this.supportEmail; }
    public void setSupportEmail(String supportEmail) { this.supportEmail = supportEmail; }


    // --- Builder Pattern ---
    public static SupportEmailUpdateRequestBuilder builder() {
        return new SupportEmailUpdateRequestBuilder();
    }

    public static class SupportEmailUpdateRequestBuilder {
        private String supportEmail;

        public SupportEmailUpdateRequestBuilder() {}

        public SupportEmailUpdateRequestBuilder supportEmail(String supportEmail) {
            this.supportEmail = supportEmail;
            return this;
        }

        public SupportEmailUpdateRequest build() {
            SupportEmailUpdateRequest instance = new SupportEmailUpdateRequest();
            instance.supportEmail = this.supportEmail;
            return instance;
        }
    }

}
