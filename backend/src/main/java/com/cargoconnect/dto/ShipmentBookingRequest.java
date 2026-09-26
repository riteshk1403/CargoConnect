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


    // --- Standard Constructors ---
    public ShipmentBookingRequest() {}

    public ShipmentBookingRequest(String pickupAddress, String deliveryAddress, Double pickupLatitude, Double pickupLongitude, Double deliveryLatitude, Double deliveryLongitude, Long customerId, String goodsType, String cargoDescription, Double weight, String vehicleTypeRequired, LocalDate pickupDate, String pickupTime, LocalDate deliveryDate, ServiceType serviceType, PaymentMethod paymentMethod, String contactName, String contactPhone, String specialInstructions, String specialRequirements, String cargoPhotoUrl) {
        this.pickupAddress = pickupAddress;
        this.deliveryAddress = deliveryAddress;
        this.pickupLatitude = pickupLatitude;
        this.pickupLongitude = pickupLongitude;
        this.deliveryLatitude = deliveryLatitude;
        this.deliveryLongitude = deliveryLongitude;
        this.customerId = customerId;
        this.goodsType = goodsType;
        this.cargoDescription = cargoDescription;
        this.weight = weight;
        this.vehicleTypeRequired = vehicleTypeRequired;
        this.pickupDate = pickupDate;
        this.pickupTime = pickupTime;
        this.deliveryDate = deliveryDate;
        this.serviceType = serviceType;
        this.paymentMethod = paymentMethod;
        this.contactName = contactName;
        this.contactPhone = contactPhone;
        this.specialInstructions = specialInstructions;
        this.specialRequirements = specialRequirements;
        this.cargoPhotoUrl = cargoPhotoUrl;
    }


    // --- Getters & Setters ---
    public String getPickupAddress() { return this.pickupAddress; }
    public void setPickupAddress(String pickupAddress) { this.pickupAddress = pickupAddress; }
    public String getDeliveryAddress() { return this.deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }
    public Double getPickupLatitude() { return this.pickupLatitude; }
    public void setPickupLatitude(Double pickupLatitude) { this.pickupLatitude = pickupLatitude; }
    public Double getPickupLongitude() { return this.pickupLongitude; }
    public void setPickupLongitude(Double pickupLongitude) { this.pickupLongitude = pickupLongitude; }
    public Double getDeliveryLatitude() { return this.deliveryLatitude; }
    public void setDeliveryLatitude(Double deliveryLatitude) { this.deliveryLatitude = deliveryLatitude; }
    public Double getDeliveryLongitude() { return this.deliveryLongitude; }
    public void setDeliveryLongitude(Double deliveryLongitude) { this.deliveryLongitude = deliveryLongitude; }
    public Long getCustomerId() { return this.customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public String getGoodsType() { return this.goodsType; }
    public void setGoodsType(String goodsType) { this.goodsType = goodsType; }
    public String getCargoDescription() { return this.cargoDescription; }
    public void setCargoDescription(String cargoDescription) { this.cargoDescription = cargoDescription; }
    public Double getWeight() { return this.weight; }
    public void setWeight(Double weight) { this.weight = weight; }
    public String getVehicleTypeRequired() { return this.vehicleTypeRequired; }
    public void setVehicleTypeRequired(String vehicleTypeRequired) { this.vehicleTypeRequired = vehicleTypeRequired; }
    public LocalDate getPickupDate() { return this.pickupDate; }
    public void setPickupDate(LocalDate pickupDate) { this.pickupDate = pickupDate; }
    public String getPickupTime() { return this.pickupTime; }
    public void setPickupTime(String pickupTime) { this.pickupTime = pickupTime; }
    public LocalDate getDeliveryDate() { return this.deliveryDate; }
    public void setDeliveryDate(LocalDate deliveryDate) { this.deliveryDate = deliveryDate; }
    public ServiceType getServiceType() { return this.serviceType; }
    public void setServiceType(ServiceType serviceType) { this.serviceType = serviceType; }
    public PaymentMethod getPaymentMethod() { return this.paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }
    public String getContactName() { return this.contactName; }
    public void setContactName(String contactName) { this.contactName = contactName; }
    public String getContactPhone() { return this.contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
    public String getSpecialInstructions() { return this.specialInstructions; }
    public void setSpecialInstructions(String specialInstructions) { this.specialInstructions = specialInstructions; }
    public String getSpecialRequirements() { return this.specialRequirements; }
    public void setSpecialRequirements(String specialRequirements) { this.specialRequirements = specialRequirements; }
    public String getCargoPhotoUrl() { return this.cargoPhotoUrl; }
    public void setCargoPhotoUrl(String cargoPhotoUrl) { this.cargoPhotoUrl = cargoPhotoUrl; }


    // --- Builder Pattern ---
    public static ShipmentBookingRequestBuilder builder() {
        return new ShipmentBookingRequestBuilder();
    }

    public static class ShipmentBookingRequestBuilder {
        private String pickupAddress;
        private String deliveryAddress;
        private Double pickupLatitude;
        private Double pickupLongitude;
        private Double deliveryLatitude;
        private Double deliveryLongitude;
        private Long customerId;
        private String goodsType;
        private String cargoDescription;
        private Double weight;
        private String vehicleTypeRequired;
        private LocalDate pickupDate;
        private String pickupTime;
        private LocalDate deliveryDate;
        private ServiceType serviceType;
        private PaymentMethod paymentMethod;
        private String contactName;
        private String contactPhone;
        private String specialInstructions;
        private String specialRequirements;
        private String cargoPhotoUrl;

        public ShipmentBookingRequestBuilder() {}

        public ShipmentBookingRequestBuilder pickupAddress(String pickupAddress) {
            this.pickupAddress = pickupAddress;
            return this;
        }

        public ShipmentBookingRequestBuilder deliveryAddress(String deliveryAddress) {
            this.deliveryAddress = deliveryAddress;
            return this;
        }

        public ShipmentBookingRequestBuilder pickupLatitude(Double pickupLatitude) {
            this.pickupLatitude = pickupLatitude;
            return this;
        }

        public ShipmentBookingRequestBuilder pickupLongitude(Double pickupLongitude) {
            this.pickupLongitude = pickupLongitude;
            return this;
        }

        public ShipmentBookingRequestBuilder deliveryLatitude(Double deliveryLatitude) {
            this.deliveryLatitude = deliveryLatitude;
            return this;
        }

        public ShipmentBookingRequestBuilder deliveryLongitude(Double deliveryLongitude) {
            this.deliveryLongitude = deliveryLongitude;
            return this;
        }

        public ShipmentBookingRequestBuilder customerId(Long customerId) {
            this.customerId = customerId;
            return this;
        }

        public ShipmentBookingRequestBuilder goodsType(String goodsType) {
            this.goodsType = goodsType;
            return this;
        }

        public ShipmentBookingRequestBuilder cargoDescription(String cargoDescription) {
            this.cargoDescription = cargoDescription;
            return this;
        }

        public ShipmentBookingRequestBuilder weight(Double weight) {
            this.weight = weight;
            return this;
        }

        public ShipmentBookingRequestBuilder vehicleTypeRequired(String vehicleTypeRequired) {
            this.vehicleTypeRequired = vehicleTypeRequired;
            return this;
        }

        public ShipmentBookingRequestBuilder pickupDate(LocalDate pickupDate) {
            this.pickupDate = pickupDate;
            return this;
        }

        public ShipmentBookingRequestBuilder pickupTime(String pickupTime) {
            this.pickupTime = pickupTime;
            return this;
        }

        public ShipmentBookingRequestBuilder deliveryDate(LocalDate deliveryDate) {
            this.deliveryDate = deliveryDate;
            return this;
        }

        public ShipmentBookingRequestBuilder serviceType(ServiceType serviceType) {
            this.serviceType = serviceType;
            return this;
        }

        public ShipmentBookingRequestBuilder paymentMethod(PaymentMethod paymentMethod) {
            this.paymentMethod = paymentMethod;
            return this;
        }

        public ShipmentBookingRequestBuilder contactName(String contactName) {
            this.contactName = contactName;
            return this;
        }

        public ShipmentBookingRequestBuilder contactPhone(String contactPhone) {
            this.contactPhone = contactPhone;
            return this;
        }

        public ShipmentBookingRequestBuilder specialInstructions(String specialInstructions) {
            this.specialInstructions = specialInstructions;
            return this;
        }

        public ShipmentBookingRequestBuilder specialRequirements(String specialRequirements) {
            this.specialRequirements = specialRequirements;
            return this;
        }

        public ShipmentBookingRequestBuilder cargoPhotoUrl(String cargoPhotoUrl) {
            this.cargoPhotoUrl = cargoPhotoUrl;
            return this;
        }

        public ShipmentBookingRequest build() {
            ShipmentBookingRequest instance = new ShipmentBookingRequest();
            instance.pickupAddress = this.pickupAddress;
            instance.deliveryAddress = this.deliveryAddress;
            instance.pickupLatitude = this.pickupLatitude;
            instance.pickupLongitude = this.pickupLongitude;
            instance.deliveryLatitude = this.deliveryLatitude;
            instance.deliveryLongitude = this.deliveryLongitude;
            instance.customerId = this.customerId;
            instance.goodsType = this.goodsType;
            instance.cargoDescription = this.cargoDescription;
            instance.weight = this.weight;
            instance.vehicleTypeRequired = this.vehicleTypeRequired;
            instance.pickupDate = this.pickupDate;
            instance.pickupTime = this.pickupTime;
            instance.deliveryDate = this.deliveryDate;
            instance.serviceType = this.serviceType;
            instance.paymentMethod = this.paymentMethod;
            instance.contactName = this.contactName;
            instance.contactPhone = this.contactPhone;
            instance.specialInstructions = this.specialInstructions;
            instance.specialRequirements = this.specialRequirements;
            instance.cargoPhotoUrl = this.cargoPhotoUrl;
            return instance;
        }
    }

}
