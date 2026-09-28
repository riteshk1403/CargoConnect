package com.cargoconnect.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "shipments",
       indexes = {
           @Index(name = "idx_shipment_customer", columnList = "customerId"),
           @Index(name = "idx_shipment_partner", columnList = "confirmedPartnerId"),
           @Index(name = "idx_shipment_status", columnList = "status"),
           @Index(name = "idx_shipment_fare_status", columnList = "fareStatus")
       })
public class Shipment {
    public enum ServiceType {
        NORMAL,
        EXPRESS
    }

    public enum Status {
        PENDING_ASSIGNMENT,
        QUOTED,
        PARTNER_NOTIFIED,
        PARTNER_ACCEPTED,
        ASSIGNED,
        PICKED_UP,
        IN_TRANSIT,
        OUT_FOR_DELIVERY,
        DELIVERED,
        CANCELLED,
        DELIVERY_FAILED,
        DELAYED
    }

    public enum FareStatus {
        PENDING,
        QUOTED,
        ACCEPTED,
        REJECTED,
        NEGOTIATE
    }

    public enum PaymentMethod {
        ONLINE,
        COD,
        CORPORATE_CREDIT
    }

    public enum PaymentStatus {
        PENDING,
        PAID,
        FAILED,
        REFUNDED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String shipmentId; // e.g. "CC-10245"

    @Column(nullable = false)
    private String pickupAddress;

    @Column(nullable = false)
    private String deliveryAddress;

    private Double pickupLatitude;
    private Double pickupLongitude;
    private Double deliveryLatitude;
    private Double deliveryLongitude;

    private Long customerId;
    private Long confirmedPartnerId; // Confirmed Cargo Partner
    private Long assignedVehicleId;   // Selected by Cargo Partner
    private Long assignedDriverId;    // Assigned by Cargo Partner
    private Long driverId;            // Backward-compat alias
    private Long vehicleId;           // Backward-compat alias

    private String goodsType; // Cargo type e.g., Electronics, Industrial Machinery
    private String cargoDescription;

    @Column(nullable = false)
    private Double weight; // kg

    private String vehicleTypeRequired; // e.g., "14 FT Truck", "Tata Ace", "20 FT Container"

    private LocalDate pickupDate;
    private String pickupTime; // e.g. "10:00 AM"

    private LocalDate deliveryDate;

    @Enumerated(EnumType.STRING)
        private ServiceType serviceType = ServiceType.NORMAL;

    @Enumerated(EnumType.STRING)
        private Status status = Status.PENDING_ASSIGNMENT;

    // Manual Quotation fields
    private Double fare; // Set manually by CargoConnect Team

    @Enumerated(EnumType.STRING)
        private FareStatus fareStatus = FareStatus.PENDING;

    private String fareSetBy;
    private LocalDateTime fareSetAt;

    // Backward-compat price getter/setter
    public Double getPrice() {
        return fare != null ? fare : 0.0;
    }
    public void setPrice(Double p) {
        this.fare = p;
    }

    // Territory Broadcast fields
    private Double broadcastRadiusKm;
    private LocalDateTime broadcastAt;

    // Partner Confirmation & Locked Commission fields
    private Double commissionRate; // e.g. 10.0%
    private Double commissionAmount; // e.g. 500.0
    private Double partnerAmount; // e.g. 4500.0
    private String commissionSetBy;
    private LocalDateTime commissionSetAt;
    private LocalDateTime confirmedAt;

    @Enumerated(EnumType.STRING)
        private PaymentMethod paymentMethod = PaymentMethod.ONLINE;

    @Enumerated(EnumType.STRING)
        private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    private String deliveryOtp; // 4-digit OTP for Proof of Delivery verification

    private String contactName;
    private String contactPhone;
    private String specialRequirements;

    @Column(columnDefinition = "TEXT")
    private String cargoPhotoUrl; // Photo URL or Base64 sample

        private Double cancellationFee = 0.0;

    private String routeCity;
    private String notes;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deliveredAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (updatedAt == null) updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }


    // --- Standard Constructors ---
    public Shipment() {}

    public Shipment(Long id, String shipmentId, String pickupAddress, String deliveryAddress, Double pickupLatitude, Double pickupLongitude, Double deliveryLatitude, Double deliveryLongitude, Long customerId, Long confirmedPartnerId, Long assignedVehicleId, Long assignedDriverId, Long driverId, Long vehicleId, String goodsType, String cargoDescription, Double weight, String vehicleTypeRequired, LocalDate pickupDate, String pickupTime, LocalDate deliveryDate, ServiceType serviceType, Status status, Double fare, FareStatus fareStatus, String fareSetBy, LocalDateTime fareSetAt, Double broadcastRadiusKm, LocalDateTime broadcastAt, Double commissionRate, Double commissionAmount, Double partnerAmount, String commissionSetBy, LocalDateTime commissionSetAt, LocalDateTime confirmedAt, PaymentMethod paymentMethod, PaymentStatus paymentStatus, String deliveryOtp, String contactName, String contactPhone, String specialRequirements, String cargoPhotoUrl, Double cancellationFee, String routeCity, String notes, LocalDateTime createdAt, LocalDateTime updatedAt, LocalDateTime deliveredAt) {
        this.id = id;
        this.shipmentId = shipmentId;
        this.pickupAddress = pickupAddress;
        this.deliveryAddress = deliveryAddress;
        this.pickupLatitude = pickupLatitude;
        this.pickupLongitude = pickupLongitude;
        this.deliveryLatitude = deliveryLatitude;
        this.deliveryLongitude = deliveryLongitude;
        this.customerId = customerId;
        this.confirmedPartnerId = confirmedPartnerId;
        this.assignedVehicleId = assignedVehicleId;
        this.assignedDriverId = assignedDriverId;
        this.driverId = driverId;
        this.vehicleId = vehicleId;
        this.goodsType = goodsType;
        this.cargoDescription = cargoDescription;
        this.weight = weight;
        this.vehicleTypeRequired = vehicleTypeRequired;
        this.pickupDate = pickupDate;
        this.pickupTime = pickupTime;
        this.deliveryDate = deliveryDate;
        this.serviceType = serviceType;
        this.status = status;
        this.fare = fare;
        this.fareStatus = fareStatus;
        this.fareSetBy = fareSetBy;
        this.fareSetAt = fareSetAt;
        this.broadcastRadiusKm = broadcastRadiusKm;
        this.broadcastAt = broadcastAt;
        this.commissionRate = commissionRate;
        this.commissionAmount = commissionAmount;
        this.partnerAmount = partnerAmount;
        this.commissionSetBy = commissionSetBy;
        this.commissionSetAt = commissionSetAt;
        this.confirmedAt = confirmedAt;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
        this.deliveryOtp = deliveryOtp;
        this.contactName = contactName;
        this.contactPhone = contactPhone;
        this.specialRequirements = specialRequirements;
        this.cargoPhotoUrl = cargoPhotoUrl;
        this.cancellationFee = cancellationFee;
        this.routeCity = routeCity;
        this.notes = notes;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deliveredAt = deliveredAt;
    }


    // --- Getters & Setters ---
    public Long getId() { return this.id; }
    public void setId(Long id) { this.id = id; }
    public String getShipmentId() { return this.shipmentId; }
    public void setShipmentId(String shipmentId) { this.shipmentId = shipmentId; }
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
    public Long getConfirmedPartnerId() { return this.confirmedPartnerId; }
    public void setConfirmedPartnerId(Long confirmedPartnerId) { this.confirmedPartnerId = confirmedPartnerId; }
    public Long getAssignedVehicleId() { return this.assignedVehicleId; }
    public void setAssignedVehicleId(Long assignedVehicleId) { this.assignedVehicleId = assignedVehicleId; }
    public Long getAssignedDriverId() { return this.assignedDriverId; }
    public void setAssignedDriverId(Long assignedDriverId) { this.assignedDriverId = assignedDriverId; }
    public Long getDriverId() { return this.driverId; }
    public void setDriverId(Long driverId) { this.driverId = driverId; }
    public Long getVehicleId() { return this.vehicleId; }
    public void setVehicleId(Long vehicleId) { this.vehicleId = vehicleId; }
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
    public Status getStatus() { return this.status; }
    public void setStatus(Status status) { this.status = status; }
    public Double getFare() { return this.fare; }
    public void setFare(Double fare) { this.fare = fare; }
    public FareStatus getFareStatus() { return this.fareStatus; }
    public void setFareStatus(FareStatus fareStatus) { this.fareStatus = fareStatus; }
    public String getFareSetBy() { return this.fareSetBy; }
    public void setFareSetBy(String fareSetBy) { this.fareSetBy = fareSetBy; }
    public LocalDateTime getFareSetAt() { return this.fareSetAt; }
    public void setFareSetAt(LocalDateTime fareSetAt) { this.fareSetAt = fareSetAt; }
    public Double getBroadcastRadiusKm() { return this.broadcastRadiusKm; }
    public void setBroadcastRadiusKm(Double broadcastRadiusKm) { this.broadcastRadiusKm = broadcastRadiusKm; }
    public LocalDateTime getBroadcastAt() { return this.broadcastAt; }
    public void setBroadcastAt(LocalDateTime broadcastAt) { this.broadcastAt = broadcastAt; }
    public Double getCommissionRate() { return this.commissionRate; }
    public void setCommissionRate(Double commissionRate) { this.commissionRate = commissionRate; }
    public Double getCommissionAmount() { return this.commissionAmount; }
    public void setCommissionAmount(Double commissionAmount) { this.commissionAmount = commissionAmount; }
    public Double getPartnerAmount() { return this.partnerAmount; }
    public void setPartnerAmount(Double partnerAmount) { this.partnerAmount = partnerAmount; }
    public String getCommissionSetBy() { return this.commissionSetBy; }
    public void setCommissionSetBy(String commissionSetBy) { this.commissionSetBy = commissionSetBy; }
    public LocalDateTime getCommissionSetAt() { return this.commissionSetAt; }
    public void setCommissionSetAt(LocalDateTime commissionSetAt) { this.commissionSetAt = commissionSetAt; }
    public LocalDateTime getConfirmedAt() { return this.confirmedAt; }
    public void setConfirmedAt(LocalDateTime confirmedAt) { this.confirmedAt = confirmedAt; }
    public PaymentMethod getPaymentMethod() { return this.paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }
    public PaymentStatus getPaymentStatus() { return this.paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }
    public String getDeliveryOtp() { return this.deliveryOtp; }
    public void setDeliveryOtp(String deliveryOtp) { this.deliveryOtp = deliveryOtp; }
    public String getContactName() { return this.contactName; }
    public void setContactName(String contactName) { this.contactName = contactName; }
    public String getContactPhone() { return this.contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
    public String getSpecialRequirements() { return this.specialRequirements; }
    public void setSpecialRequirements(String specialRequirements) { this.specialRequirements = specialRequirements; }
    public String getCargoPhotoUrl() { return this.cargoPhotoUrl; }
    public void setCargoPhotoUrl(String cargoPhotoUrl) { this.cargoPhotoUrl = cargoPhotoUrl; }
    public Double getCancellationFee() { return this.cancellationFee; }
    public void setCancellationFee(Double cancellationFee) { this.cancellationFee = cancellationFee; }
    public String getRouteCity() { return this.routeCity; }
    public void setRouteCity(String routeCity) { this.routeCity = routeCity; }
    public String getNotes() { return this.notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public LocalDateTime getCreatedAt() { return this.createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return this.updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public LocalDateTime getDeliveredAt() { return this.deliveredAt; }
    public void setDeliveredAt(LocalDateTime deliveredAt) { this.deliveredAt = deliveredAt; }


    // --- Builder Pattern ---
    public static ShipmentBuilder builder() {
        return new ShipmentBuilder();
    }

    public static class ShipmentBuilder {
        private Long id;
        private String shipmentId;
        private String pickupAddress;
        private String deliveryAddress;
        private Double pickupLatitude;
        private Double pickupLongitude;
        private Double deliveryLatitude;
        private Double deliveryLongitude;
        private Long customerId;
        private Long confirmedPartnerId;
        private Long assignedVehicleId;
        private Long assignedDriverId;
        private Long driverId;
        private Long vehicleId;
        private String goodsType;
        private String cargoDescription;
        private Double weight;
        private String vehicleTypeRequired;
        private LocalDate pickupDate;
        private String pickupTime;
        private LocalDate deliveryDate;
        private ServiceType serviceType;
        private Status status;
        private Double fare;
        private FareStatus fareStatus;
        private String fareSetBy;
        private LocalDateTime fareSetAt;
        private Double broadcastRadiusKm;
        private LocalDateTime broadcastAt;
        private Double commissionRate;
        private Double commissionAmount;
        private Double partnerAmount;
        private String commissionSetBy;
        private LocalDateTime commissionSetAt;
        private LocalDateTime confirmedAt;
        private PaymentMethod paymentMethod;
        private PaymentStatus paymentStatus;
        private String deliveryOtp;
        private String contactName;
        private String contactPhone;
        private String specialRequirements;
        private String cargoPhotoUrl;
        private Double cancellationFee;
        private String routeCity;
        private String notes;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private LocalDateTime deliveredAt;

        public ShipmentBuilder() {}

        public ShipmentBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public ShipmentBuilder shipmentId(String shipmentId) {
            this.shipmentId = shipmentId;
            return this;
        }

        public ShipmentBuilder pickupAddress(String pickupAddress) {
            this.pickupAddress = pickupAddress;
            return this;
        }

        public ShipmentBuilder deliveryAddress(String deliveryAddress) {
            this.deliveryAddress = deliveryAddress;
            return this;
        }

        public ShipmentBuilder pickupLatitude(Double pickupLatitude) {
            this.pickupLatitude = pickupLatitude;
            return this;
        }

        public ShipmentBuilder pickupLongitude(Double pickupLongitude) {
            this.pickupLongitude = pickupLongitude;
            return this;
        }

        public ShipmentBuilder deliveryLatitude(Double deliveryLatitude) {
            this.deliveryLatitude = deliveryLatitude;
            return this;
        }

        public ShipmentBuilder deliveryLongitude(Double deliveryLongitude) {
            this.deliveryLongitude = deliveryLongitude;
            return this;
        }

        public ShipmentBuilder customerId(Long customerId) {
            this.customerId = customerId;
            return this;
        }

        public ShipmentBuilder confirmedPartnerId(Long confirmedPartnerId) {
            this.confirmedPartnerId = confirmedPartnerId;
            return this;
        }

        public ShipmentBuilder assignedVehicleId(Long assignedVehicleId) {
            this.assignedVehicleId = assignedVehicleId;
            return this;
        }

        public ShipmentBuilder assignedDriverId(Long assignedDriverId) {
            this.assignedDriverId = assignedDriverId;
            return this;
        }

        public ShipmentBuilder driverId(Long driverId) {
            this.driverId = driverId;
            return this;
        }

        public ShipmentBuilder vehicleId(Long vehicleId) {
            this.vehicleId = vehicleId;
            return this;
        }

        public ShipmentBuilder goodsType(String goodsType) {
            this.goodsType = goodsType;
            return this;
        }

        public ShipmentBuilder cargoDescription(String cargoDescription) {
            this.cargoDescription = cargoDescription;
            return this;
        }

        public ShipmentBuilder weight(Double weight) {
            this.weight = weight;
            return this;
        }

        public ShipmentBuilder vehicleTypeRequired(String vehicleTypeRequired) {
            this.vehicleTypeRequired = vehicleTypeRequired;
            return this;
        }

        public ShipmentBuilder pickupDate(LocalDate pickupDate) {
            this.pickupDate = pickupDate;
            return this;
        }

        public ShipmentBuilder pickupTime(String pickupTime) {
            this.pickupTime = pickupTime;
            return this;
        }

        public ShipmentBuilder deliveryDate(LocalDate deliveryDate) {
            this.deliveryDate = deliveryDate;
            return this;
        }

        public ShipmentBuilder serviceType(ServiceType serviceType) {
            this.serviceType = serviceType;
            return this;
        }

        public ShipmentBuilder status(Status status) {
            this.status = status;
            return this;
        }

        public ShipmentBuilder fare(Double fare) {
            this.fare = fare;
            return this;
        }

        public ShipmentBuilder fareStatus(FareStatus fareStatus) {
            this.fareStatus = fareStatus;
            return this;
        }

        public ShipmentBuilder fareSetBy(String fareSetBy) {
            this.fareSetBy = fareSetBy;
            return this;
        }

        public ShipmentBuilder fareSetAt(LocalDateTime fareSetAt) {
            this.fareSetAt = fareSetAt;
            return this;
        }

        public ShipmentBuilder broadcastRadiusKm(Double broadcastRadiusKm) {
            this.broadcastRadiusKm = broadcastRadiusKm;
            return this;
        }

        public ShipmentBuilder broadcastAt(LocalDateTime broadcastAt) {
            this.broadcastAt = broadcastAt;
            return this;
        }

        public ShipmentBuilder commissionRate(Double commissionRate) {
            this.commissionRate = commissionRate;
            return this;
        }

        public ShipmentBuilder commissionAmount(Double commissionAmount) {
            this.commissionAmount = commissionAmount;
            return this;
        }

        public ShipmentBuilder partnerAmount(Double partnerAmount) {
            this.partnerAmount = partnerAmount;
            return this;
        }

        public ShipmentBuilder commissionSetBy(String commissionSetBy) {
            this.commissionSetBy = commissionSetBy;
            return this;
        }

        public ShipmentBuilder commissionSetAt(LocalDateTime commissionSetAt) {
            this.commissionSetAt = commissionSetAt;
            return this;
        }

        public ShipmentBuilder confirmedAt(LocalDateTime confirmedAt) {
            this.confirmedAt = confirmedAt;
            return this;
        }

        public ShipmentBuilder paymentMethod(PaymentMethod paymentMethod) {
            this.paymentMethod = paymentMethod;
            return this;
        }

        public ShipmentBuilder paymentStatus(PaymentStatus paymentStatus) {
            this.paymentStatus = paymentStatus;
            return this;
        }

        public ShipmentBuilder deliveryOtp(String deliveryOtp) {
            this.deliveryOtp = deliveryOtp;
            return this;
        }

        public ShipmentBuilder contactName(String contactName) {
            this.contactName = contactName;
            return this;
        }

        public ShipmentBuilder contactPhone(String contactPhone) {
            this.contactPhone = contactPhone;
            return this;
        }

        public ShipmentBuilder specialRequirements(String specialRequirements) {
            this.specialRequirements = specialRequirements;
            return this;
        }

        public ShipmentBuilder cargoPhotoUrl(String cargoPhotoUrl) {
            this.cargoPhotoUrl = cargoPhotoUrl;
            return this;
        }

        public ShipmentBuilder cancellationFee(Double cancellationFee) {
            this.cancellationFee = cancellationFee;
            return this;
        }

        public ShipmentBuilder routeCity(String routeCity) {
            this.routeCity = routeCity;
            return this;
        }

        public ShipmentBuilder notes(String notes) {
            this.notes = notes;
            return this;
        }

        public ShipmentBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public ShipmentBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public ShipmentBuilder deliveredAt(LocalDateTime deliveredAt) {
            this.deliveredAt = deliveredAt;
            return this;
        }

        public Shipment build() {
            Shipment instance = new Shipment();
            instance.id = this.id;
            instance.shipmentId = this.shipmentId;
            instance.pickupAddress = this.pickupAddress;
            instance.deliveryAddress = this.deliveryAddress;
            instance.pickupLatitude = this.pickupLatitude;
            instance.pickupLongitude = this.pickupLongitude;
            instance.deliveryLatitude = this.deliveryLatitude;
            instance.deliveryLongitude = this.deliveryLongitude;
            instance.customerId = this.customerId;
            instance.confirmedPartnerId = this.confirmedPartnerId;
            instance.assignedVehicleId = this.assignedVehicleId;
            instance.assignedDriverId = this.assignedDriverId;
            instance.driverId = this.driverId;
            instance.vehicleId = this.vehicleId;
            instance.goodsType = this.goodsType;
            instance.cargoDescription = this.cargoDescription;
            instance.weight = this.weight;
            instance.vehicleTypeRequired = this.vehicleTypeRequired;
            instance.pickupDate = this.pickupDate;
            instance.pickupTime = this.pickupTime;
            instance.deliveryDate = this.deliveryDate;
            instance.serviceType = this.serviceType;
            instance.status = this.status;
            instance.fare = this.fare;
            instance.fareStatus = this.fareStatus;
            instance.fareSetBy = this.fareSetBy;
            instance.fareSetAt = this.fareSetAt;
            instance.broadcastRadiusKm = this.broadcastRadiusKm;
            instance.broadcastAt = this.broadcastAt;
            instance.commissionRate = this.commissionRate;
            instance.commissionAmount = this.commissionAmount;
            instance.partnerAmount = this.partnerAmount;
            instance.commissionSetBy = this.commissionSetBy;
            instance.commissionSetAt = this.commissionSetAt;
            instance.confirmedAt = this.confirmedAt;
            instance.paymentMethod = this.paymentMethod;
            instance.paymentStatus = this.paymentStatus;
            instance.deliveryOtp = this.deliveryOtp;
            instance.contactName = this.contactName;
            instance.contactPhone = this.contactPhone;
            instance.specialRequirements = this.specialRequirements;
            instance.cargoPhotoUrl = this.cargoPhotoUrl;
            instance.cancellationFee = this.cancellationFee;
            instance.routeCity = this.routeCity;
            instance.notes = this.notes;
            instance.createdAt = this.createdAt;
            instance.updatedAt = this.updatedAt;
            instance.deliveredAt = this.deliveredAt;
            return instance;
        }
    }

}
