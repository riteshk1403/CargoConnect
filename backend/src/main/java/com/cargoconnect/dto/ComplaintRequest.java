package com.cargoconnect.dto;

import com.cargoconnect.model.Complaint.Type;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ComplaintRequest {
    @NotNull(message = "Customer ID is required")
    private Long customerId;

    private Long shipmentId;

    @NotNull(message = "Complaint type is required")
    private Type type;

    @NotBlank(message = "Complaint description is required")
    private String description;
}
