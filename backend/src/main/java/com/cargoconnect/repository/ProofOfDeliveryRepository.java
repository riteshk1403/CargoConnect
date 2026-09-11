package com.cargoconnect.repository;

import com.cargoconnect.model.ProofOfDelivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProofOfDeliveryRepository extends JpaRepository<ProofOfDelivery, Long> {
    Optional<ProofOfDelivery> findByShipmentId(Long shipmentId);
}
