package com.cargoconnect.dto;

import jakarta.validation.constraints.NotBlank;

public class OtpVerificationRequest {
    @NotBlank(message = "OTP is required to verify delivery")
    private String otp;

    private String signatureData;
    private String photoUrl;
    private String notes;

    public String getEnteredOtp() {
        return otp;
    }

    public void setEnteredOtp(String enteredOtp) {
        this.otp = enteredOtp;
    }


    // --- Standard Constructors ---
    public OtpVerificationRequest() {}

    public OtpVerificationRequest(String otp, String signatureData, String photoUrl, String notes) {
        this.otp = otp;
        this.signatureData = signatureData;
        this.photoUrl = photoUrl;
        this.notes = notes;
    }


    // --- Getters & Setters ---
    public String getOtp() { return this.otp; }
    public void setOtp(String otp) { this.otp = otp; }
    public String getSignatureData() { return this.signatureData; }
    public void setSignatureData(String signatureData) { this.signatureData = signatureData; }
    public String getPhotoUrl() { return this.photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }
    public String getNotes() { return this.notes; }
    public void setNotes(String notes) { this.notes = notes; }


    // --- Builder Pattern ---
    public static OtpVerificationRequestBuilder builder() {
        return new OtpVerificationRequestBuilder();
    }

    public static class OtpVerificationRequestBuilder {
        private String otp;
        private String signatureData;
        private String photoUrl;
        private String notes;

        public OtpVerificationRequestBuilder() {}

        public OtpVerificationRequestBuilder otp(String otp) {
            this.otp = otp;
            return this;
        }

        public OtpVerificationRequestBuilder signatureData(String signatureData) {
            this.signatureData = signatureData;
            return this;
        }

        public OtpVerificationRequestBuilder photoUrl(String photoUrl) {
            this.photoUrl = photoUrl;
            return this;
        }

        public OtpVerificationRequestBuilder notes(String notes) {
            this.notes = notes;
            return this;
        }

        public OtpVerificationRequest build() {
            OtpVerificationRequest instance = new OtpVerificationRequest();
            instance.otp = this.otp;
            instance.signatureData = this.signatureData;
            instance.photoUrl = this.photoUrl;
            instance.notes = this.notes;
            return instance;
        }
    }

}
