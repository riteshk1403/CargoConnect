package com.cargoconnect.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResetPasswordRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Valid email is required")
    private String email;

    @NotBlank(message = "OTP is required")
    @Pattern(regexp = "^[0-9]{6}$", message = "OTP must be a 6-digit numeric code")
    private String otp;

    @NotBlank(message = "New password is required")
    @Size(min = 6, max = 50, message = "Password must be between 6 and 50 characters")
    private String newPassword;


    // --- Standard Constructors ---
    public ResetPasswordRequest() {}

    public ResetPasswordRequest(String email, String otp, String newPassword) {
        this.email = email;
        this.otp = otp;
        this.newPassword = newPassword;
    }


    // --- Getters & Setters ---
    public String getEmail() { return this.email; }
    public void setEmail(String email) { this.email = email; }
    public String getOtp() { return this.otp; }
    public void setOtp(String otp) { this.otp = otp; }
    public String getNewPassword() { return this.newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }


    // --- Builder Pattern ---
    public static ResetPasswordRequestBuilder builder() {
        return new ResetPasswordRequestBuilder();
    }

    public static class ResetPasswordRequestBuilder {
        private String email;
        private String otp;
        private String newPassword;

        public ResetPasswordRequestBuilder() {}

        public ResetPasswordRequestBuilder email(String email) {
            this.email = email;
            return this;
        }

        public ResetPasswordRequestBuilder otp(String otp) {
            this.otp = otp;
            return this;
        }

        public ResetPasswordRequestBuilder newPassword(String newPassword) {
            this.newPassword = newPassword;
            return this;
        }

        public ResetPasswordRequest build() {
            ResetPasswordRequest instance = new ResetPasswordRequest();
            instance.email = this.email;
            instance.otp = this.otp;
            instance.newPassword = this.newPassword;
            return instance;
        }
    }

}
