package com.cargoconnect.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ComplaintResolveRequest {
    @NotBlank(message = "Resolution action is required (e.g. RESOLVED, REJECTED, FULL_REFUND, PARTIAL_REFUND)")
    private String resolution;

    private String actionTaken;
    private Double customAmount;


    // --- Standard Constructors ---
    public ComplaintResolveRequest() {}

    public ComplaintResolveRequest(String resolution, String actionTaken, Double customAmount) {
        this.resolution = resolution;
        this.actionTaken = actionTaken;
        this.customAmount = customAmount;
    }


    // --- Getters & Setters ---
    public String getResolution() { return this.resolution; }
    public void setResolution(String resolution) { this.resolution = resolution; }
    public String getActionTaken() { return this.actionTaken; }
    public void setActionTaken(String actionTaken) { this.actionTaken = actionTaken; }
    public Double getCustomAmount() { return this.customAmount; }
    public void setCustomAmount(Double customAmount) { this.customAmount = customAmount; }


    // --- Builder Pattern ---
    public static ComplaintResolveRequestBuilder builder() {
        return new ComplaintResolveRequestBuilder();
    }

    public static class ComplaintResolveRequestBuilder {
        private String resolution;
        private String actionTaken;
        private Double customAmount;

        public ComplaintResolveRequestBuilder() {}

        public ComplaintResolveRequestBuilder resolution(String resolution) {
            this.resolution = resolution;
            return this;
        }

        public ComplaintResolveRequestBuilder actionTaken(String actionTaken) {
            this.actionTaken = actionTaken;
            return this;
        }

        public ComplaintResolveRequestBuilder customAmount(Double customAmount) {
            this.customAmount = customAmount;
            return this;
        }

        public ComplaintResolveRequest build() {
            ComplaintResolveRequest instance = new ComplaintResolveRequest();
            instance.resolution = this.resolution;
            instance.actionTaken = this.actionTaken;
            instance.customAmount = this.customAmount;
            return instance;
        }
    }

}
