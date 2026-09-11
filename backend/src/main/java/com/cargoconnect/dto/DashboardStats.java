package com.cargoconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStats {
    private long totalCustomers;
    private long totalCargoPartners;
    private long totalDrivers;
    private long availableDrivers;
    private long assignedDrivers;

    private long totalVehicles;
    private long availableVehicles;
    private long assignedVehicles;
    private long maintenanceVehicles;

    private long totalShipments;
    private long pendingShipments;
    private long activeShipments;
    private long deliveredShipments;
    private long cancelledShipments;
    private long failedShipments;

    private long pendingDocuments;
    private long pendingComplaints;

    // Marketplace Financial Metrics
    private Double totalGrossShipmentValue; // Total Fare Value
    private Double totalCommissionEarned;   // CargoConnect Revenue
    private Double totalPartnerPayout;      // Net amount to Partners
    private Double totalRevenue;            // Alias

    private Double vehicleUtilization;
    private Double driverPerformance;
    private Double partnerRating;
}
