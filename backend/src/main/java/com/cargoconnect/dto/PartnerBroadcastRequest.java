package com.cargoconnect.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class PartnerBroadcastRequest {
    private Double pickupLatitude;
    private Double pickupLongitude;
    private String pickupAddress;

    @NotNull(message = "Radius is required")
    @Positive(message = "Radius must be positive")
    private Double radiusKm; // e.g. 20.0 KM
}
