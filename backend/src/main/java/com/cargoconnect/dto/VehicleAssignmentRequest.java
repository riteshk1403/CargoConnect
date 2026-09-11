package com.cargoconnect.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class VehicleAssignmentRequest {
    @NotNull(message = "Vehicle ID is required")
    private Long vehicleId;

    @NotNull(message = "Driver ID is required")
    private Long driverId;
}
