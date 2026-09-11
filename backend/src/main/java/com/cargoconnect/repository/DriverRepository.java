package com.cargoconnect.repository;

import com.cargoconnect.model.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
    Optional<Driver> findByLicenseNumber(String licenseNumber);
    Optional<Driver> findByPhone(String phone);
    List<Driver> findByStatus(Driver.Status status);
    List<Driver> findByStatusAndVerificationStatus(Driver.Status status, Driver.VerificationStatus verificationStatus);
    List<Driver> findByVerificationStatus(Driver.VerificationStatus verificationStatus);
    List<Driver> findByCargoPartnerId(Long cargoPartnerId);
    List<Driver> findByCargoPartnerIdAndStatus(Long cargoPartnerId, Driver.Status status);
    List<Driver> findByCargoPartnerIdAndStatusAndVerificationStatus(Long cargoPartnerId, Driver.Status status, Driver.VerificationStatus verificationStatus);
}
