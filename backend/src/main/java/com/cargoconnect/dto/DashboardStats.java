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


    // --- Standard Constructors ---
    public DashboardStats() {}

    public DashboardStats(long totalCustomers, long totalCargoPartners, long totalDrivers, long availableDrivers, long assignedDrivers, long totalVehicles, long availableVehicles, long assignedVehicles, long maintenanceVehicles, long totalShipments, long pendingShipments, long activeShipments, long deliveredShipments, long cancelledShipments, long failedShipments, long pendingDocuments, long pendingComplaints, Double totalGrossShipmentValue, Double totalCommissionEarned, Double totalPartnerPayout, Double totalRevenue, Double vehicleUtilization, Double driverPerformance, Double partnerRating) {
        this.totalCustomers = totalCustomers;
        this.totalCargoPartners = totalCargoPartners;
        this.totalDrivers = totalDrivers;
        this.availableDrivers = availableDrivers;
        this.assignedDrivers = assignedDrivers;
        this.totalVehicles = totalVehicles;
        this.availableVehicles = availableVehicles;
        this.assignedVehicles = assignedVehicles;
        this.maintenanceVehicles = maintenanceVehicles;
        this.totalShipments = totalShipments;
        this.pendingShipments = pendingShipments;
        this.activeShipments = activeShipments;
        this.deliveredShipments = deliveredShipments;
        this.cancelledShipments = cancelledShipments;
        this.failedShipments = failedShipments;
        this.pendingDocuments = pendingDocuments;
        this.pendingComplaints = pendingComplaints;
        this.totalGrossShipmentValue = totalGrossShipmentValue;
        this.totalCommissionEarned = totalCommissionEarned;
        this.totalPartnerPayout = totalPartnerPayout;
        this.totalRevenue = totalRevenue;
        this.vehicleUtilization = vehicleUtilization;
        this.driverPerformance = driverPerformance;
        this.partnerRating = partnerRating;
    }


    // --- Getters & Setters ---
    public long getTotalCustomers() { return this.totalCustomers; }
    public void setTotalCustomers(long totalCustomers) { this.totalCustomers = totalCustomers; }
    public long getTotalCargoPartners() { return this.totalCargoPartners; }
    public void setTotalCargoPartners(long totalCargoPartners) { this.totalCargoPartners = totalCargoPartners; }
    public long getTotalDrivers() { return this.totalDrivers; }
    public void setTotalDrivers(long totalDrivers) { this.totalDrivers = totalDrivers; }
    public long getAvailableDrivers() { return this.availableDrivers; }
    public void setAvailableDrivers(long availableDrivers) { this.availableDrivers = availableDrivers; }
    public long getAssignedDrivers() { return this.assignedDrivers; }
    public void setAssignedDrivers(long assignedDrivers) { this.assignedDrivers = assignedDrivers; }
    public long getTotalVehicles() { return this.totalVehicles; }
    public void setTotalVehicles(long totalVehicles) { this.totalVehicles = totalVehicles; }
    public long getAvailableVehicles() { return this.availableVehicles; }
    public void setAvailableVehicles(long availableVehicles) { this.availableVehicles = availableVehicles; }
    public long getAssignedVehicles() { return this.assignedVehicles; }
    public void setAssignedVehicles(long assignedVehicles) { this.assignedVehicles = assignedVehicles; }
    public long getMaintenanceVehicles() { return this.maintenanceVehicles; }
    public void setMaintenanceVehicles(long maintenanceVehicles) { this.maintenanceVehicles = maintenanceVehicles; }
    public long getTotalShipments() { return this.totalShipments; }
    public void setTotalShipments(long totalShipments) { this.totalShipments = totalShipments; }
    public long getPendingShipments() { return this.pendingShipments; }
    public void setPendingShipments(long pendingShipments) { this.pendingShipments = pendingShipments; }
    public long getActiveShipments() { return this.activeShipments; }
    public void setActiveShipments(long activeShipments) { this.activeShipments = activeShipments; }
    public long getDeliveredShipments() { return this.deliveredShipments; }
    public void setDeliveredShipments(long deliveredShipments) { this.deliveredShipments = deliveredShipments; }
    public long getCancelledShipments() { return this.cancelledShipments; }
    public void setCancelledShipments(long cancelledShipments) { this.cancelledShipments = cancelledShipments; }
    public long getFailedShipments() { return this.failedShipments; }
    public void setFailedShipments(long failedShipments) { this.failedShipments = failedShipments; }
    public long getPendingDocuments() { return this.pendingDocuments; }
    public void setPendingDocuments(long pendingDocuments) { this.pendingDocuments = pendingDocuments; }
    public long getPendingComplaints() { return this.pendingComplaints; }
    public void setPendingComplaints(long pendingComplaints) { this.pendingComplaints = pendingComplaints; }
    public Double getTotalGrossShipmentValue() { return this.totalGrossShipmentValue; }
    public void setTotalGrossShipmentValue(Double totalGrossShipmentValue) { this.totalGrossShipmentValue = totalGrossShipmentValue; }
    public Double getTotalCommissionEarned() { return this.totalCommissionEarned; }
    public void setTotalCommissionEarned(Double totalCommissionEarned) { this.totalCommissionEarned = totalCommissionEarned; }
    public Double getTotalPartnerPayout() { return this.totalPartnerPayout; }
    public void setTotalPartnerPayout(Double totalPartnerPayout) { this.totalPartnerPayout = totalPartnerPayout; }
    public Double getTotalRevenue() { return this.totalRevenue; }
    public void setTotalRevenue(Double totalRevenue) { this.totalRevenue = totalRevenue; }
    public Double getVehicleUtilization() { return this.vehicleUtilization; }
    public void setVehicleUtilization(Double vehicleUtilization) { this.vehicleUtilization = vehicleUtilization; }
    public Double getDriverPerformance() { return this.driverPerformance; }
    public void setDriverPerformance(Double driverPerformance) { this.driverPerformance = driverPerformance; }
    public Double getPartnerRating() { return this.partnerRating; }
    public void setPartnerRating(Double partnerRating) { this.partnerRating = partnerRating; }


    // --- Builder Pattern ---
    public static DashboardStatsBuilder builder() {
        return new DashboardStatsBuilder();
    }

    public static class DashboardStatsBuilder {
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
        private Double totalGrossShipmentValue;
        private Double totalCommissionEarned;
        private Double totalPartnerPayout;
        private Double totalRevenue;
        private Double vehicleUtilization;
        private Double driverPerformance;
        private Double partnerRating;

        public DashboardStatsBuilder() {}

        public DashboardStatsBuilder totalCustomers(long totalCustomers) {
            this.totalCustomers = totalCustomers;
            return this;
        }

        public DashboardStatsBuilder totalCargoPartners(long totalCargoPartners) {
            this.totalCargoPartners = totalCargoPartners;
            return this;
        }

        public DashboardStatsBuilder totalDrivers(long totalDrivers) {
            this.totalDrivers = totalDrivers;
            return this;
        }

        public DashboardStatsBuilder availableDrivers(long availableDrivers) {
            this.availableDrivers = availableDrivers;
            return this;
        }

        public DashboardStatsBuilder assignedDrivers(long assignedDrivers) {
            this.assignedDrivers = assignedDrivers;
            return this;
        }

        public DashboardStatsBuilder totalVehicles(long totalVehicles) {
            this.totalVehicles = totalVehicles;
            return this;
        }

        public DashboardStatsBuilder availableVehicles(long availableVehicles) {
            this.availableVehicles = availableVehicles;
            return this;
        }

        public DashboardStatsBuilder assignedVehicles(long assignedVehicles) {
            this.assignedVehicles = assignedVehicles;
            return this;
        }

        public DashboardStatsBuilder maintenanceVehicles(long maintenanceVehicles) {
            this.maintenanceVehicles = maintenanceVehicles;
            return this;
        }

        public DashboardStatsBuilder totalShipments(long totalShipments) {
            this.totalShipments = totalShipments;
            return this;
        }

        public DashboardStatsBuilder pendingShipments(long pendingShipments) {
            this.pendingShipments = pendingShipments;
            return this;
        }

        public DashboardStatsBuilder activeShipments(long activeShipments) {
            this.activeShipments = activeShipments;
            return this;
        }

        public DashboardStatsBuilder deliveredShipments(long deliveredShipments) {
            this.deliveredShipments = deliveredShipments;
            return this;
        }

        public DashboardStatsBuilder cancelledShipments(long cancelledShipments) {
            this.cancelledShipments = cancelledShipments;
            return this;
        }

        public DashboardStatsBuilder failedShipments(long failedShipments) {
            this.failedShipments = failedShipments;
            return this;
        }

        public DashboardStatsBuilder pendingDocuments(long pendingDocuments) {
            this.pendingDocuments = pendingDocuments;
            return this;
        }

        public DashboardStatsBuilder pendingComplaints(long pendingComplaints) {
            this.pendingComplaints = pendingComplaints;
            return this;
        }

        public DashboardStatsBuilder totalGrossShipmentValue(Double totalGrossShipmentValue) {
            this.totalGrossShipmentValue = totalGrossShipmentValue;
            return this;
        }

        public DashboardStatsBuilder totalCommissionEarned(Double totalCommissionEarned) {
            this.totalCommissionEarned = totalCommissionEarned;
            return this;
        }

        public DashboardStatsBuilder totalPartnerPayout(Double totalPartnerPayout) {
            this.totalPartnerPayout = totalPartnerPayout;
            return this;
        }

        public DashboardStatsBuilder totalRevenue(Double totalRevenue) {
            this.totalRevenue = totalRevenue;
            return this;
        }

        public DashboardStatsBuilder vehicleUtilization(Double vehicleUtilization) {
            this.vehicleUtilization = vehicleUtilization;
            return this;
        }

        public DashboardStatsBuilder driverPerformance(Double driverPerformance) {
            this.driverPerformance = driverPerformance;
            return this;
        }

        public DashboardStatsBuilder partnerRating(Double partnerRating) {
            this.partnerRating = partnerRating;
            return this;
        }

        public DashboardStats build() {
            DashboardStats instance = new DashboardStats();
            instance.totalCustomers = this.totalCustomers;
            instance.totalCargoPartners = this.totalCargoPartners;
            instance.totalDrivers = this.totalDrivers;
            instance.availableDrivers = this.availableDrivers;
            instance.assignedDrivers = this.assignedDrivers;
            instance.totalVehicles = this.totalVehicles;
            instance.availableVehicles = this.availableVehicles;
            instance.assignedVehicles = this.assignedVehicles;
            instance.maintenanceVehicles = this.maintenanceVehicles;
            instance.totalShipments = this.totalShipments;
            instance.pendingShipments = this.pendingShipments;
            instance.activeShipments = this.activeShipments;
            instance.deliveredShipments = this.deliveredShipments;
            instance.cancelledShipments = this.cancelledShipments;
            instance.failedShipments = this.failedShipments;
            instance.pendingDocuments = this.pendingDocuments;
            instance.pendingComplaints = this.pendingComplaints;
            instance.totalGrossShipmentValue = this.totalGrossShipmentValue;
            instance.totalCommissionEarned = this.totalCommissionEarned;
            instance.totalPartnerPayout = this.totalPartnerPayout;
            instance.totalRevenue = this.totalRevenue;
            instance.vehicleUtilization = this.vehicleUtilization;
            instance.driverPerformance = this.driverPerformance;
            instance.partnerRating = this.partnerRating;
            return instance;
        }
    }

}
