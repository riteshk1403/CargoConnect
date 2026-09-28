package com.cargoconnect.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class CommissionSettingDto {
    private String commissionType = "PERCENTAGE";

    @NotNull(message = "Commission rate is required")
    @Positive(message = "Commission rate must be positive")
    private Double commissionRate; // e.g. 10.0


    // --- Standard Constructors ---
    public CommissionSettingDto() {}

    public CommissionSettingDto(String commissionType, Double commissionRate) {
        this.commissionType = commissionType;
        this.commissionRate = commissionRate;
    }


    // --- Getters & Setters ---
    public String getCommissionType() { return this.commissionType; }
    public void setCommissionType(String commissionType) { this.commissionType = commissionType; }
    public Double getCommissionRate() { return this.commissionRate; }
    public void setCommissionRate(Double commissionRate) { this.commissionRate = commissionRate; }


    // --- Builder Pattern ---
    public static CommissionSettingDtoBuilder builder() {
        return new CommissionSettingDtoBuilder();
    }

    public static class CommissionSettingDtoBuilder {
        private String commissionType;
        private Double commissionRate;

        public CommissionSettingDtoBuilder() {}

        public CommissionSettingDtoBuilder commissionType(String commissionType) {
            this.commissionType = commissionType;
            return this;
        }

        public CommissionSettingDtoBuilder commissionRate(Double commissionRate) {
            this.commissionRate = commissionRate;
            return this;
        }

        public CommissionSettingDto build() {
            CommissionSettingDto instance = new CommissionSettingDto();
            instance.commissionType = this.commissionType;
            instance.commissionRate = this.commissionRate;
            return instance;
        }
    }

}
