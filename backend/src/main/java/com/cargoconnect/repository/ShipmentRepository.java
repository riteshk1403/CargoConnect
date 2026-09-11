package com.cargoconnect.repository;

import com.cargoconnect.model.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
    Optional<Shipment> findByShipmentId(String shipmentId);
    List<Shipment> findByCustomerId(Long customerId);
    List<Shipment> findByConfirmedPartnerId(Long confirmedPartnerId);
    List<Shipment> findByAssignedDriverId(Long assignedDriverId);
    List<Shipment> findByAssignedVehicleId(Long assignedVehicleId);
    List<Shipment> findByDriverId(Long driverId);
    List<Shipment> findByVehicleId(Long vehicleId);
    List<Shipment> findByStatus(Shipment.Status status);
    List<Shipment> findByStatusIn(List<Shipment.Status> statuses);
    List<Shipment> findByFareStatus(Shipment.FareStatus fareStatus);
    List<Shipment> findByConfirmedPartnerIdAndStatusIn(Long confirmedPartnerId, List<Shipment.Status> statuses);
    List<Shipment> findByVehicleIdAndStatusIn(Long vehicleId, List<Shipment.Status> statuses);
    List<Shipment> findByAssignedVehicleIdAndStatusIn(Long assignedVehicleId, List<Shipment.Status> statuses);
}
