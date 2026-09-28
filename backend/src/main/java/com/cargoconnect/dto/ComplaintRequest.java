package com.cargoconnect.dto;

import com.cargoconnect.model.Complaint.Type;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ComplaintRequest {
    @NotNull(message = "Customer ID is required")
    private Long customerId;

    private Long shipmentId;

    @NotNull(message = "Complaint type is required")
    private Type type;

    @NotBlank(message = "Complaint description is required")
    private String description;


    // --- Standard Constructors ---
    public ComplaintRequest() {}

    public ComplaintRequest(Long customerId, Long shipmentId, Type type, String description) {
        this.customerId = customerId;
        this.shipmentId = shipmentId;
        this.type = type;
        this.description = description;
    }


    // --- Getters & Setters ---
    public Long getCustomerId() { return this.customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public Long getShipmentId() { return this.shipmentId; }
    public void setShipmentId(Long shipmentId) { this.shipmentId = shipmentId; }
    public Type getType() { return this.type; }
    public void setType(Type type) { this.type = type; }
    public String getDescription() { return this.description; }
    public void setDescription(String description) { this.description = description; }


    // --- Builder Pattern ---
    public static ComplaintRequestBuilder builder() {
        return new ComplaintRequestBuilder();
    }

    public static class ComplaintRequestBuilder {
        private Long customerId;
        private Long shipmentId;
        private Type type;
        private String description;

        public ComplaintRequestBuilder() {}

        public ComplaintRequestBuilder customerId(Long customerId) {
            this.customerId = customerId;
            return this;
        }

        public ComplaintRequestBuilder shipmentId(Long shipmentId) {
            this.shipmentId = shipmentId;
            return this;
        }

        public ComplaintRequestBuilder type(Type type) {
            this.type = type;
            return this;
        }

        public ComplaintRequestBuilder description(String description) {
            this.description = description;
            return this;
        }

        public ComplaintRequest build() {
            ComplaintRequest instance = new ComplaintRequest();
            instance.customerId = this.customerId;
            instance.shipmentId = this.shipmentId;
            instance.type = this.type;
            instance.description = this.description;
            return instance;
        }
    }

}
