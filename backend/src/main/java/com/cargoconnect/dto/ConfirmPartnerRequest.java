package com.cargoconnect.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ConfirmPartnerRequest {
    @NotNull(message = "Cargo Partner ID is required")
    private Long partnerId;


    // --- Standard Constructors ---
    public ConfirmPartnerRequest() {}

    public ConfirmPartnerRequest(Long partnerId) {
        this.partnerId = partnerId;
    }


    // --- Getters & Setters ---
    public Long getPartnerId() { return this.partnerId; }
    public void setPartnerId(Long partnerId) { this.partnerId = partnerId; }


    // --- Builder Pattern ---
    public static ConfirmPartnerRequestBuilder builder() {
        return new ConfirmPartnerRequestBuilder();
    }

    public static class ConfirmPartnerRequestBuilder {
        private Long partnerId;

        public ConfirmPartnerRequestBuilder() {}

        public ConfirmPartnerRequestBuilder partnerId(Long partnerId) {
            this.partnerId = partnerId;
            return this;
        }

        public ConfirmPartnerRequest build() {
            ConfirmPartnerRequest instance = new ConfirmPartnerRequest();
            instance.partnerId = this.partnerId;
            return instance;
        }
    }

}
