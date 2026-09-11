package com.cargoconnect.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DriverRatingRequest {
    @NotNull(message = "Shipment ID is required")
    private Long shipmentId;

    @NotNull(message = "Rating score is required")
    @Min(value = 1, message = "Rating must be at least 1 star")
    @Max(value = 5, message = "Rating cannot exceed 5 stars")
    private Integer rating;

    private String feedback;
}
