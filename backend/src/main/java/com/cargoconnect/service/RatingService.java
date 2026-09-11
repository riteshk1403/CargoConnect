package com.cargoconnect.service;

import com.cargoconnect.dto.DriverRatingRequest;
import com.cargoconnect.exception.BadRequestException;
import com.cargoconnect.exception.ResourceNotFoundException;
import com.cargoconnect.model.Driver;
import com.cargoconnect.model.DriverRating;
import com.cargoconnect.model.Shipment;
import com.cargoconnect.repository.DriverRatingRepository;
import com.cargoconnect.repository.DriverRepository;
import com.cargoconnect.repository.ShipmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RatingService {
    @Autowired
    private DriverRatingRepository driverRatingRepository;

    @Autowired
    private ShipmentRepository shipmentRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private AuditLogService auditLogService;

    @Transactional
    public DriverRating rateDriver(DriverRatingRequest request, Long customerId, String username) {
        Shipment shipment = shipmentRepository.findById(request.getShipmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found with id: " + request.getShipmentId()));

        if (shipment.getStatus() != Shipment.Status.DELIVERED) {
            throw new BadRequestException("You can only rate a driver after the shipment is successfully delivered.");
        }

        if (driverRatingRepository.existsByShipmentId(shipment.getId())) {
            throw new BadRequestException("You have already submitted a rating for this completed shipment.");
        }

        if (shipment.getDriverId() == null) {
            throw new BadRequestException("No driver associated with this shipment.");
        }

        Driver driver = driverRepository.findById(shipment.getDriverId())
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + shipment.getDriverId()));

        DriverRating rating = DriverRating.builder()
                .shipmentId(shipment.getId())
                .driverId(driver.getId())
                .customerId(customerId)
                .rating(request.getRating())
                .feedback(request.getFeedback())
                .createdAt(LocalDateTime.now())
                .build();

        rating = driverRatingRepository.save(rating);

        // Recalculate Driver Average Rating
        List<DriverRating> allDriverRatings = driverRatingRepository.findByDriverId(driver.getId());
        double avg = allDriverRatings.stream().mapToInt(DriverRating::getRating).average().orElse(5.0);
        driver.setRating(Math.round(avg * 10.0) / 10.0);
        driver.setTotalRatings(allDriverRatings.size());
        driverRepository.save(driver);

        auditLogService.log(username, "SHIPPER", "DRIVER_RATED", "DRIVER",
                String.valueOf(driver.getId()), "Rated " + request.getRating() + " stars for shipment " + shipment.getShipmentId());

        return rating;
    }

    public List<DriverRating> getRatingsForDriver(Long driverId) {
        return driverRatingRepository.findByDriverId(driverId);
    }
}
