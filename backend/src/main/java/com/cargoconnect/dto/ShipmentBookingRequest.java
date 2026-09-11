package com.cargoconnect.dto;

import com.cargoconnect.model.Shipment.ServiceType;
import com.cargoconnect.model.Shipment.PaymentMethod;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ShipmentBookingRequest {
    @NotBlank(message = "Pickup address is required")
    private String pickupAddress;

    @NotBlank(message = "Delivery address is required")
    private String deliveryAddress;

    private Double pickupLatitude;
    private Double pickupLongitude;
    private Double deliveryLatitude;
    private Double deliveryLongitude;

    @NotNull(message = "Customer ID is required")
    private Long customerId;

    private String goodsType;
    private String cargoDescription;

    @NotNull(message = "Weight is required")
    @Min(value = 1, message = "Weight must be at least 1 kg")
    private Double weight;

    private String vehicleTypeRequired; // e.g., "Tata Ace", "14 FT Truck", "Pickup Van"

    private LocalDate pickupDate;
    private String pickupTime; // e.g. "10:00 AM"

    private LocalDate deliveryDate;

    private ServiceType serviceType = ServiceType.NORMAL;

    private PaymentMethod paymentMethod = PaymentMethod.ONLINE;

    private String contactName;
    private String contactPhone;
    private String specialInstructions;
    private String specialRequirements;

    private String cargoPhotoUrl;
}
