package com.cargoconnect.repository;

import com.cargoconnect.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    Optional<Vehicle> findByVehicleNumber(String vehicleNumber);
    List<Vehicle> findByStatus(Vehicle.Status status);
    List<Vehicle> findByStatusAndVerificationStatus(Vehicle.Status status, Vehicle.VerificationStatus verificationStatus);
    List<Vehicle> findByVerificationStatus(Vehicle.VerificationStatus verificationStatus);
    List<Vehicle> findByCargoPartnerId(Long cargoPartnerId);
    List<Vehicle> findByCargoPartnerIdAndStatus(Long cargoPartnerId, Vehicle.Status status);
    List<Vehicle> findByCargoPartnerIdAndStatusAndVerificationStatus(Long cargoPartnerId, Vehicle.Status status, Vehicle.VerificationStatus verificationStatus);
}
