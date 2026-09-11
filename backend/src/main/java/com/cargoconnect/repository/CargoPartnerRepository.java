package com.cargoconnect.repository;

import com.cargoconnect.model.CargoPartner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CargoPartnerRepository extends JpaRepository<CargoPartner, Long> {
    Optional<CargoPartner> findByEmail(String email);
    boolean existsByEmail(String email);
    List<CargoPartner> findByStatus(CargoPartner.Status status);
    List<CargoPartner> findByVerificationStatus(CargoPartner.VerificationStatus verificationStatus);
    List<CargoPartner> findByStatusAndVerificationStatus(CargoPartner.Status status, CargoPartner.VerificationStatus verificationStatus);
    List<CargoPartner> findByCityIgnoreCase(String city);
}
