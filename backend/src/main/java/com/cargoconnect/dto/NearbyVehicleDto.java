package com.cargoconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NearbyVehicleDto {
    private Long vehicleId;
    private String vehicleNumber;
    private String vehicleType;
    private Double capacity;
    private Double usedCapacity;
    private Double remainingCapacity;
    private Double latitude;
    private Double longitude;
    private Double distanceKm; // Calculated Haversine distance from pickup location
    private String vehicleStatus;
    private String vehicleVerificationStatus;

    // Associated driver details if available
    private Long driverId;
    private String driverName;
    private String driverPhone;
    private Double driverRating;
    private String driverStatus;
    private String driverVerificationStatus;

    private boolean isSuitable; // true if capacity >= weight & verified & valid docs
    private String suitabilityReason;
}
