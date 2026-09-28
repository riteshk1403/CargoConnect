package com.cargoconnect.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class ForgotPasswordRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Valid email is required")
    private String email;


    // --- Standard Constructors ---
    public ForgotPasswordRequest() {}

    public ForgotPasswordRequest(String email) {
        this.email = email;
    }


    // --- Getters & Setters ---
    public String getEmail() { return this.email; }
    public void setEmail(String email) { this.email = email; }


    // --- Builder Pattern ---
    public static ForgotPasswordRequestBuilder builder() {
        return new ForgotPasswordRequestBuilder();
    }

    public static class ForgotPasswordRequestBuilder {
        private String email;

        public ForgotPasswordRequestBuilder() {}

        public ForgotPasswordRequestBuilder email(String email) {
            this.email = email;
            return this;
        }

        public ForgotPasswordRequest build() {
            ForgotPasswordRequest instance = new ForgotPasswordRequest();
            instance.email = this.email;
            return instance;
        }
    }

}
