package com.cargoconnect.service;

import com.cargoconnect.entity.VehicleType;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class PricingService {
    public BigDecimal calculateEstimatedPrice(double distanceKm, double weightKg, VehicleType vehicleType) {
        double basePrice = 150.0;
        double distanceCharge = distanceKm * 5.0;
        double weightCharge = weightKg * 8.0;
        double vehicleMultiplier = switch (vehicleType) {
            case BIKE -> 1.0;
            case MINI_TRUCK -> 1.5;
            case TRUCK -> 2.2;
            case CONTAINER -> 3.0;
            default -> 1.0;
        };

        double total = (basePrice + distanceCharge + weightCharge) * vehicleMultiplier;
        return BigDecimal.valueOf(total).setScale(2, java.math.RoundingMode.HALF_UP);
    }
}
