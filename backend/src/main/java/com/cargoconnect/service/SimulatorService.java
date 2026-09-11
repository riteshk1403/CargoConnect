package com.cargoconnect.service;

import com.cargoconnect.exception.ResourceNotFoundException;
import com.cargoconnect.model.Driver;
import com.cargoconnect.model.Shipment;
import com.cargoconnect.model.Vehicle;
import com.cargoconnect.repository.DriverRepository;
import com.cargoconnect.repository.ShipmentRepository;
import com.cargoconnect.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SimulatorService {
    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private ShipmentRepository shipmentRepository;

    @Autowired
    private ShipmentService shipmentService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private AuditLogService auditLogService;

    @Transactional
    public Vehicle triggerVehicleBreakdown(Long vehicleId, String reason) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + vehicleId));

        vehicle.setStatus(Vehicle.Status.UNDER_MAINTENANCE);
        vehicle = vehicleRepository.save(vehicle);

        List<Shipment> activeShipments = shipmentRepository.findByVehicleIdAndStatusIn(
                vehicleId, List.of(Shipment.Status.ASSIGNED, Shipment.Status.PICKED_UP, Shipment.Status.IN_TRANSIT, Shipment.Status.OUT_FOR_DELIVERY));

        for (Shipment s : activeShipments) {
            shipmentService.reportVehicleBreakdown(s.getId(), reason, "SIMULATOR");
        }

        auditLogService.log("SIMULATOR", "SYSTEM", "SIMULATE_BREAKDOWN", "VEHICLE",
                String.valueOf(vehicleId), "Triggered vehicle breakdown: " + reason);

        return vehicle;
    }

    @Transactional
    public Driver triggerDriverSickLeave(Long driverId, String reason) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + driverId));

        driver.setStatus(Driver.Status.UNAVAILABLE);
        driver = driverRepository.save(driver);

        List<Shipment> activeShipments = shipmentRepository.findByDriverId(driverId);
        for (Shipment s : activeShipments) {
            if (s.getStatus() == Shipment.Status.ASSIGNED || s.getStatus() == Shipment.Status.PICKED_UP || s.getStatus() == Shipment.Status.IN_TRANSIT) {
                shipmentService.reportVehicleBreakdown(s.getId(), "Driver reported sudden illness / unavailable", "SIMULATOR");
            }
        }

        auditLogService.log("SIMULATOR", "SYSTEM", "SIMULATE_DRIVER_SICK", "DRIVER",
                String.valueOf(driverId), "Driver placed on emergency sick leave: " + reason);

        return driver;
    }
}
