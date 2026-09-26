package com.cargoconnect.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RazorpayVerifyRequest {

    @NotNull(message = "Settlement ID is required")
    private Long settlementId;

    @NotBlank(message = "Razorpay Order ID is required")
    private String razorpayOrderId;

    @NotBlank(message = "Razorpay Payment ID is required")
    private String razorpayPaymentId;

    @NotBlank(message = "Razorpay Signature is required")
    private String razorpaySignature;


    // --- Standard Constructors ---
    public RazorpayVerifyRequest() {}

    public RazorpayVerifyRequest(Long settlementId, String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        this.settlementId = settlementId;
        this.razorpayOrderId = razorpayOrderId;
        this.razorpayPaymentId = razorpayPaymentId;
        this.razorpaySignature = razorpaySignature;
    }


    // --- Getters & Setters ---
    public Long getSettlementId() { return this.settlementId; }
    public void setSettlementId(Long settlementId) { this.settlementId = settlementId; }
    public String getRazorpayOrderId() { return this.razorpayOrderId; }
    public void setRazorpayOrderId(String razorpayOrderId) { this.razorpayOrderId = razorpayOrderId; }
    public String getRazorpayPaymentId() { return this.razorpayPaymentId; }
    public void setRazorpayPaymentId(String razorpayPaymentId) { this.razorpayPaymentId = razorpayPaymentId; }
    public String getRazorpaySignature() { return this.razorpaySignature; }
    public void setRazorpaySignature(String razorpaySignature) { this.razorpaySignature = razorpaySignature; }


    // --- Builder Pattern ---
    public static RazorpayVerifyRequestBuilder builder() {
        return new RazorpayVerifyRequestBuilder();
    }

    public static class RazorpayVerifyRequestBuilder {
        private Long settlementId;
        private String razorpayOrderId;
        private String razorpayPaymentId;
        private String razorpaySignature;

        public RazorpayVerifyRequestBuilder() {}

        public RazorpayVerifyRequestBuilder settlementId(Long settlementId) {
            this.settlementId = settlementId;
            return this;
        }

        public RazorpayVerifyRequestBuilder razorpayOrderId(String razorpayOrderId) {
            this.razorpayOrderId = razorpayOrderId;
            return this;
        }

        public RazorpayVerifyRequestBuilder razorpayPaymentId(String razorpayPaymentId) {
            this.razorpayPaymentId = razorpayPaymentId;
            return this;
        }

        public RazorpayVerifyRequestBuilder razorpaySignature(String razorpaySignature) {
            this.razorpaySignature = razorpaySignature;
            return this;
        }

        public RazorpayVerifyRequest build() {
            RazorpayVerifyRequest instance = new RazorpayVerifyRequest();
            instance.settlementId = this.settlementId;
            instance.razorpayOrderId = this.razorpayOrderId;
            instance.razorpayPaymentId = this.razorpayPaymentId;
            instance.razorpaySignature = this.razorpaySignature;
            return instance;
        }
    }

}
