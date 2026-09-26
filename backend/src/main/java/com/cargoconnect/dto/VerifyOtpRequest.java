package com.cargoconnect.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerifyOtpRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Valid email is required")
    private String email;

    @NotBlank(message = "OTP is required")
    @Pattern(regexp = "^[0-9]{6}$", message = "OTP must be a 6-digit numeric code")
    private String otp;


    // --- Standard Constructors ---
    public VerifyOtpRequest() {}

    public VerifyOtpRequest(String email, String otp) {
        this.email = email;
        this.otp = otp;
    }


    // --- Getters & Setters ---
    public String getEmail() { return this.email; }
    public void setEmail(String email) { this.email = email; }
    public String getOtp() { return this.otp; }
    public void setOtp(String otp) { this.otp = otp; }


    // --- Builder Pattern ---
    public static VerifyOtpRequestBuilder builder() {
        return new VerifyOtpRequestBuilder();
    }

    public static class VerifyOtpRequestBuilder {
        private String email;
        private String otp;

        public VerifyOtpRequestBuilder() {}

        public VerifyOtpRequestBuilder email(String email) {
            this.email = email;
            return this;
        }

        public VerifyOtpRequestBuilder otp(String otp) {
            this.otp = otp;
            return this;
        }

        public VerifyOtpRequest build() {
            VerifyOtpRequest instance = new VerifyOtpRequest();
            instance.email = this.email;
            instance.otp = this.otp;
            return instance;
        }
    }

}
