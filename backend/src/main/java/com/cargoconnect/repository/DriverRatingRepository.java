package com.cargoconnect.repository;

import com.cargoconnect.model.DriverRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRatingRepository extends JpaRepository<DriverRating, Long> {
    Optional<DriverRating> findByShipmentId(Long shipmentId);
    List<DriverRating> findByDriverId(Long driverId);
    boolean existsByShipmentId(Long shipmentId);
}
