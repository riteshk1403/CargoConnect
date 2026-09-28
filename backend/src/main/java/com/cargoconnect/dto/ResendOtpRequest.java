package com.cargoconnect.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class ResendOtpRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Valid email is required")
    private String email;


    // --- Standard Constructors ---
    public ResendOtpRequest() {}

    public ResendOtpRequest(String email) {
        this.email = email;
    }


    // --- Getters & Setters ---
    public String getEmail() { return this.email; }
    public void setEmail(String email) { this.email = email; }


    // --- Builder Pattern ---
    public static ResendOtpRequestBuilder builder() {
        return new ResendOtpRequestBuilder();
    }

    public static class ResendOtpRequestBuilder {
        private String email;

        public ResendOtpRequestBuilder() {}

        public ResendOtpRequestBuilder email(String email) {
            this.email = email;
            return this;
        }

        public ResendOtpRequest build() {
            ResendOtpRequest instance = new ResendOtpRequest();
            instance.email = this.email;
            return instance;
        }
    }

}
