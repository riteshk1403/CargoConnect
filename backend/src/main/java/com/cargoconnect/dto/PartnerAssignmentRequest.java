package com.cargoconnect.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PartnerAssignmentRequest {
    @NotNull(message = "Vehicle ID is required")
    private Long vehicleId;

    @NotNull(message = "Driver ID is required")
    private Long driverId;
}
