package com.cargoconnect.dto;

import com.cargoconnect.model.DocumentEntity.Status;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DocumentVerifyRequest {
    @NotNull(message = "Verification status is required (VERIFIED or REJECTED)")
    private Status status;

    private String rejectionReason;


    // --- Standard Constructors ---
    public DocumentVerifyRequest() {}

    public DocumentVerifyRequest(Status status, String rejectionReason) {
        this.status = status;
        this.rejectionReason = rejectionReason;
    }


    // --- Getters & Setters ---
    public Status getStatus() { return this.status; }
    public void setStatus(Status status) { this.status = status; }
    public String getRejectionReason() { return this.rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }


    // --- Builder Pattern ---
    public static DocumentVerifyRequestBuilder builder() {
        return new DocumentVerifyRequestBuilder();
    }

    public static class DocumentVerifyRequestBuilder {
        private Status status;
        private String rejectionReason;

        public DocumentVerifyRequestBuilder() {}

        public DocumentVerifyRequestBuilder status(Status status) {
            this.status = status;
            return this;
        }

        public DocumentVerifyRequestBuilder rejectionReason(String rejectionReason) {
            this.rejectionReason = rejectionReason;
            return this;
        }

        public DocumentVerifyRequest build() {
            DocumentVerifyRequest instance = new DocumentVerifyRequest();
            instance.status = this.status;
            instance.rejectionReason = this.rejectionReason;
            return instance;
        }
    }

}
