package com.cargoconnect.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CallRequestDto {
    private Long customerId;
    private Long shipmentId;

    @NotBlank(message = "Reason is required: NEW_SHIPMENT, FARE_DISCUSSION, SHIPMENT_ISSUE, PAYMENT, OTHER")
    private String reason;

    private String preferredTime;
    private String contactPhone;
    private String notes;
}
