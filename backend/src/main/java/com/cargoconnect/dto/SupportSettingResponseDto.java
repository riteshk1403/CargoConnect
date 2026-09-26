package com.cargoconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupportSettingResponseDto {
    private String primaryPhone;
    private String secondaryPhone;
    private String supportEmail;
    private Boolean primaryActive;
    private Boolean secondaryActive;
    private Boolean isActive;
    private LocalDateTime updatedAt;


    // --- Standard Constructors ---
    public SupportSettingResponseDto() {}

    public SupportSettingResponseDto(String primaryPhone, String secondaryPhone, String supportEmail, Boolean primaryActive, Boolean secondaryActive, Boolean isActive, LocalDateTime updatedAt) {
        this.primaryPhone = primaryPhone;
        this.secondaryPhone = secondaryPhone;
        this.supportEmail = supportEmail;
        this.primaryActive = primaryActive;
        this.secondaryActive = secondaryActive;
        this.isActive = isActive;
        this.updatedAt = updatedAt;
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
    public Boolean isActive() { return this.isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    public LocalDateTime getUpdatedAt() { return this.updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }


    // --- Builder Pattern ---
    public static SupportSettingResponseDtoBuilder builder() {
        return new SupportSettingResponseDtoBuilder();
    }

    public static class SupportSettingResponseDtoBuilder {
        private String primaryPhone;
        private String secondaryPhone;
        private String supportEmail;
        private Boolean primaryActive;
        private Boolean secondaryActive;
        private Boolean isActive;
        private LocalDateTime updatedAt;

        public SupportSettingResponseDtoBuilder() {}

        public SupportSettingResponseDtoBuilder primaryPhone(String primaryPhone) {
            this.primaryPhone = primaryPhone;
            return this;
        }

        public SupportSettingResponseDtoBuilder secondaryPhone(String secondaryPhone) {
            this.secondaryPhone = secondaryPhone;
            return this;
        }

        public SupportSettingResponseDtoBuilder supportEmail(String supportEmail) {
            this.supportEmail = supportEmail;
            return this;
        }

        public SupportSettingResponseDtoBuilder primaryActive(Boolean primaryActive) {
            this.primaryActive = primaryActive;
            return this;
        }

        public SupportSettingResponseDtoBuilder secondaryActive(Boolean secondaryActive) {
            this.secondaryActive = secondaryActive;
            return this;
        }

        public SupportSettingResponseDtoBuilder isActive(Boolean isActive) {
            this.isActive = isActive;
            return this;
        }

        public SupportSettingResponseDtoBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public SupportSettingResponseDto build() {
            SupportSettingResponseDto instance = new SupportSettingResponseDto();
            instance.primaryPhone = this.primaryPhone;
            instance.secondaryPhone = this.secondaryPhone;
            instance.supportEmail = this.supportEmail;
            instance.primaryActive = this.primaryActive;
            instance.secondaryActive = this.secondaryActive;
            instance.isActive = this.isActive;
            instance.updatedAt = this.updatedAt;
            return instance;
        }
    }

}
