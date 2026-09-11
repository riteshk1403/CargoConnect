package com.cargoconnect.service;

import com.cargoconnect.dto.DashboardStats;
import com.cargoconnect.model.*;
import com.cargoconnect.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportService {
    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CargoPartnerRepository cargoPartnerRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private ShipmentRepository shipmentRepository;

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private ComplaintRepository complaintRepository;

    public DashboardStats getDashboardStats() {
        long totalCustomers = customerRepository.count();
        long totalPartners = cargoPartnerRepository.count();

        List<Driver> drivers = driverRepository.findAll();
        long totalDrivers = drivers.size();
        long availableDrivers = drivers.stream().filter(d -> d.getStatus() == Driver.Status.AVAILABLE).count();
        long assignedDrivers = drivers.stream().filter(d -> d.getStatus() == Driver.Status.ASSIGNED).count();

        List<Vehicle> vehicles = vehicleRepository.findAll();
        long totalVehicles = vehicles.size();
        long availableVehicles = vehicles.stream().filter(v -> v.getStatus() == Vehicle.Status.AVAILABLE).count();
        long assignedVehicles = vehicles.stream().filter(v -> v.getStatus() == Vehicle.Status.ASSIGNED || v.getStatus() == Vehicle.Status.IN_TRANSIT).count();
        long maintenanceVehicles = vehicles.stream().filter(v -> v.getStatus() == Vehicle.Status.UNDER_MAINTENANCE).count();

        List<Shipment> shipments = shipmentRepository.findAll();
        long totalShipments = shipments.size();
        long pendingShipments = shipments.stream().filter(s -> s.getStatus() == Shipment.Status.PENDING_ASSIGNMENT || s.getStatus() == Shipment.Status.QUOTED).count();
        long activeShipments = shipments.stream().filter(s -> s.getStatus() == Shipment.Status.ASSIGNED || s.getStatus() == Shipment.Status.PICKED_UP || s.getStatus() == Shipment.Status.IN_TRANSIT || s.getStatus() == Shipment.Status.OUT_FOR_DELIVERY).count();
        long deliveredShipments = shipments.stream().filter(s -> s.getStatus() == Shipment.Status.DELIVERED).count();
        long cancelledShipments = shipments.stream().filter(s -> s.getStatus() == Shipment.Status.CANCELLED).count();
        long failedShipments = shipments.stream().filter(s -> s.getStatus() == Shipment.Status.DELIVERY_FAILED).count();

        long pendingDocuments = documentRepository.findByStatus(DocumentEntity.Status.PENDING).size();
        long pendingComplaints = complaintRepository.findByStatus(Complaint.Status.PENDING).size();

        // Marketplace Financial Metrics
        double totalGrossValue = shipments.stream()
                .filter(s -> s.getStatus() == Shipment.Status.DELIVERED || s.getStatus() == Shipment.Status.ASSIGNED || s.getStatus() == Shipment.Status.IN_TRANSIT || s.getStatus() == Shipment.Status.OUT_FOR_DELIVERY)
                .mapToDouble(s -> s.getFare() != null ? s.getFare() : 0.0)
                .sum();

        double totalCommission = shipments.stream()
                .filter(s -> s.getStatus() == Shipment.Status.DELIVERED || s.getStatus() == Shipment.Status.ASSIGNED || s.getStatus() == Shipment.Status.IN_TRANSIT || s.getStatus() == Shipment.Status.OUT_FOR_DELIVERY)
                .mapToDouble(s -> s.getCommissionAmount() != null ? s.getCommissionAmount() : (s.getFare() != null ? s.getFare() * 0.10 : 0.0))
                .sum();

        double totalPartnerPayout = totalGrossValue - totalCommission;

        double vehicleUtilization = totalVehicles > 0 ? ((double) assignedVehicles / totalVehicles) * 100.0 : 0.0;
        double driverPerformance = drivers.stream().mapToDouble(d -> d.getRating() != null ? d.getRating() : 5.0).average().orElse(5.0);

        return DashboardStats.builder()
                .totalCustomers(totalCustomers)
                .totalCargoPartners(totalPartners)
                .totalDrivers(totalDrivers)
                .availableDrivers(availableDrivers)
                .assignedDrivers(assignedDrivers)
                .totalVehicles(totalVehicles)
                .availableVehicles(availableVehicles)
                .assignedVehicles(assignedVehicles)
                .maintenanceVehicles(maintenanceVehicles)
                .totalShipments(totalShipments)
                .pendingShipments(pendingShipments)
                .activeShipments(activeShipments)
                .deliveredShipments(deliveredShipments)
                .cancelledShipments(cancelledShipments)
                .failedShipments(failedShipments)
                .pendingDocuments(pendingDocuments)
                .pendingComplaints(pendingComplaints)
                .totalGrossShipmentValue(Math.round(totalGrossValue * 100.0) / 100.0)
                .totalCommissionEarned(Math.round(totalCommission * 100.0) / 100.0)
                .totalPartnerPayout(Math.round(totalPartnerPayout * 100.0) / 100.0)
                .totalRevenue(Math.round(totalCommission * 100.0) / 100.0)
                .vehicleUtilization(Math.round(vehicleUtilization * 10.0) / 10.0)
                .driverPerformance(Math.round(driverPerformance * 10.0) / 10.0)
                .build();
    }

    public DashboardStats getShipperDashboardStats(Long customerId) {
        List<Shipment> customerShipments = shipmentRepository.findByCustomerId(customerId);
        long totalShipments = customerShipments.size();
        long pendingShipments = customerShipments.stream().filter(s -> s.getStatus() == Shipment.Status.PENDING_ASSIGNMENT || s.getStatus() == Shipment.Status.QUOTED).count();
        long activeShipments = customerShipments.stream().filter(s -> s.getStatus() == Shipment.Status.ASSIGNED || s.getStatus() == Shipment.Status.PICKED_UP || s.getStatus() == Shipment.Status.IN_TRANSIT || s.getStatus() == Shipment.Status.OUT_FOR_DELIVERY).count();
        long deliveredShipments = customerShipments.stream().filter(s -> s.getStatus() == Shipment.Status.DELIVERED).count();
        long cancelledShipments = customerShipments.stream().filter(s -> s.getStatus() == Shipment.Status.CANCELLED).count();
        long failedShipments = customerShipments.stream().filter(s -> s.getStatus() == Shipment.Status.DELIVERY_FAILED).count();

        double totalSpent = customerShipments.stream()
                .filter(s -> s.getStatus() == Shipment.Status.DELIVERED)
                .mapToDouble(s -> s.getFare() != null ? s.getFare() : 0.0)
                .sum();

        long pendingComplaints = complaintRepository.findByCustomerId(customerId).stream()
                .filter(c -> c.getStatus() == Complaint.Status.PENDING)
                .count();

        return DashboardStats.builder()
                .totalShipments(totalShipments)
                .pendingShipments(pendingShipments)
                .activeShipments(activeShipments)
                .deliveredShipments(deliveredShipments)
                .cancelledShipments(cancelledShipments)
                .failedShipments(failedShipments)
                .pendingComplaints(pendingComplaints)
                .totalRevenue(Math.round(totalSpent * 100.0) / 100.0)
                .build();
    }

    public DashboardStats getPartnerDashboardStats(Long partnerId) {
        List<Shipment> partnerShipments = shipmentRepository.findByConfirmedPartnerId(partnerId);
        long totalShipments = partnerShipments.size();
        long activeShipments = partnerShipments.stream().filter(s -> s.getStatus() == Shipment.Status.ASSIGNED || s.getStatus() == Shipment.Status.PICKED_UP || s.getStatus() == Shipment.Status.IN_TRANSIT || s.getStatus() == Shipment.Status.OUT_FOR_DELIVERY).count();
        long deliveredShipments = partnerShipments.stream().filter(s -> s.getStatus() == Shipment.Status.DELIVERED).count();

        double netEarnings = partnerShipments.stream()
                .filter(s -> s.getStatus() == Shipment.Status.DELIVERED)
                .mapToDouble(s -> s.getPartnerAmount() != null ? s.getPartnerAmount() : (s.getFare() != null ? s.getFare() * 0.90 : 0.0))
                .sum();

        List<Vehicle> partnerVehicles = vehicleRepository.findByCargoPartnerId(partnerId);
        List<Driver> partnerDrivers = driverRepository.findByCargoPartnerId(partnerId);

        double partnerRating = cargoPartnerRepository.findById(partnerId).map(CargoPartner::getRating).orElse(5.0);

        return DashboardStats.builder()
                .totalShipments(totalShipments)
                .activeShipments(activeShipments)
                .deliveredShipments(deliveredShipments)
                .totalVehicles((long) partnerVehicles.size())
                .totalDrivers((long) partnerDrivers.size())
                .totalPartnerPayout(Math.round(netEarnings * 100.0) / 100.0)
                .totalRevenue(Math.round(netEarnings * 100.0) / 100.0)
                .partnerRating(partnerRating)
                .build();
    }

    public DashboardStats getDriverDashboardStats(Long driverId) {
        List<Shipment> driverShipments = shipmentRepository.findByAssignedDriverId(driverId);
        long totalShipments = driverShipments.size();
        long activeShipments = driverShipments.stream().filter(s -> s.getStatus() == Shipment.Status.ASSIGNED || s.getStatus() == Shipment.Status.PICKED_UP || s.getStatus() == Shipment.Status.IN_TRANSIT || s.getStatus() == Shipment.Status.OUT_FOR_DELIVERY).count();
        long deliveredShipments = driverShipments.stream().filter(s -> s.getStatus() == Shipment.Status.DELIVERED).count();

        double rating = driverRepository.findById(driverId).map(Driver::getRating).orElse(5.0);

        return DashboardStats.builder()
                .totalShipments(totalShipments)
                .activeShipments(activeShipments)
                .deliveredShipments(deliveredShipments)
                .driverPerformance(rating)
                .build();
    }
}
