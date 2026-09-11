package com.cargoconnect.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
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
}
