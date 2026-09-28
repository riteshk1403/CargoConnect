package com.cargoconnect.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "invoices")
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String invoiceNumber; // e.g. "INV-CC-10245"

    @Column(nullable = false)
    private Long shipmentId;

    private Long customerId;
    private String customerName;

    private Long cargoPartnerId;
    private String cargoPartnerName;

    private String pickupAddress;
    private String deliveryAddress;
    private String cargoType;
    private Double weight;
    private String serviceType;

    private Double fare;
    private Double commissionRate;
    private Double commissionAmount;
    private Double partnerAmount;
    private Double totalAmount;

    private String paymentStatus;
    private LocalDateTime invoiceDate;

    @PrePersist
    protected void onCreate() {
        if (invoiceDate == null) invoiceDate = LocalDateTime.now();
    }


    // --- Standard Constructors ---
    public Invoice() {}

    public Invoice(Long id, String invoiceNumber, Long shipmentId, Long customerId, String customerName, Long cargoPartnerId, String cargoPartnerName, String pickupAddress, String deliveryAddress, String cargoType, Double weight, String serviceType, Double fare, Double commissionRate, Double commissionAmount, Double partnerAmount, Double totalAmount, String paymentStatus, LocalDateTime invoiceDate) {
        this.id = id;
        this.invoiceNumber = invoiceNumber;
        this.shipmentId = shipmentId;
        this.customerId = customerId;
        this.customerName = customerName;
        this.cargoPartnerId = cargoPartnerId;
        this.cargoPartnerName = cargoPartnerName;
        this.pickupAddress = pickupAddress;
        this.deliveryAddress = deliveryAddress;
        this.cargoType = cargoType;
        this.weight = weight;
        this.serviceType = serviceType;
        this.fare = fare;
        this.commissionRate = commissionRate;
        this.commissionAmount = commissionAmount;
        this.partnerAmount = partnerAmount;
        this.totalAmount = totalAmount;
        this.paymentStatus = paymentStatus;
        this.invoiceDate = invoiceDate;
    }


    // --- Getters & Setters ---
    public Long getId() { return this.id; }
    public void setId(Long id) { this.id = id; }
    public String getInvoiceNumber() { return this.invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }
    public Long getShipmentId() { return this.shipmentId; }
    public void setShipmentId(Long shipmentId) { this.shipmentId = shipmentId; }
    public Long getCustomerId() { return this.customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public String getCustomerName() { return this.customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public Long getCargoPartnerId() { return this.cargoPartnerId; }
    public void setCargoPartnerId(Long cargoPartnerId) { this.cargoPartnerId = cargoPartnerId; }
    public String getCargoPartnerName() { return this.cargoPartnerName; }
    public void setCargoPartnerName(String cargoPartnerName) { this.cargoPartnerName = cargoPartnerName; }
    public String getPickupAddress() { return this.pickupAddress; }
    public void setPickupAddress(String pickupAddress) { this.pickupAddress = pickupAddress; }
    public String getDeliveryAddress() { return this.deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }
    public String getCargoType() { return this.cargoType; }
    public void setCargoType(String cargoType) { this.cargoType = cargoType; }
    public Double getWeight() { return this.weight; }
    public void setWeight(Double weight) { this.weight = weight; }
    public String getServiceType() { return this.serviceType; }
    public void setServiceType(String serviceType) { this.serviceType = serviceType; }
    public Double getFare() { return this.fare; }
    public void setFare(Double fare) { this.fare = fare; }
    public Double getCommissionRate() { return this.commissionRate; }
    public void setCommissionRate(Double commissionRate) { this.commissionRate = commissionRate; }
    public Double getCommissionAmount() { return this.commissionAmount; }
    public void setCommissionAmount(Double commissionAmount) { this.commissionAmount = commissionAmount; }
    public Double getPartnerAmount() { return this.partnerAmount; }
    public void setPartnerAmount(Double partnerAmount) { this.partnerAmount = partnerAmount; }
    public Double getTotalAmount() { return this.totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
    public String getPaymentStatus() { return this.paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
    public LocalDateTime getInvoiceDate() { return this.invoiceDate; }
    public void setInvoiceDate(LocalDateTime invoiceDate) { this.invoiceDate = invoiceDate; }


    // --- Builder Pattern ---
    public static InvoiceBuilder builder() {
        return new InvoiceBuilder();
    }

    public static class InvoiceBuilder {
        private Long id;
        private String invoiceNumber;
        private Long shipmentId;
        private Long customerId;
        private String customerName;
        private Long cargoPartnerId;
        private String cargoPartnerName;
        private String pickupAddress;
        private String deliveryAddress;
        private String cargoType;
        private Double weight;
        private String serviceType;
        private Double fare;
        private Double commissionRate;
        private Double commissionAmount;
        private Double partnerAmount;
        private Double totalAmount;
        private String paymentStatus;
        private LocalDateTime invoiceDate;

        public InvoiceBuilder() {}

        public InvoiceBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public InvoiceBuilder invoiceNumber(String invoiceNumber) {
            this.invoiceNumber = invoiceNumber;
            return this;
        }

        public InvoiceBuilder shipmentId(Long shipmentId) {
            this.shipmentId = shipmentId;
            return this;
        }

        public InvoiceBuilder customerId(Long customerId) {
            this.customerId = customerId;
            return this;
        }

        public InvoiceBuilder customerName(String customerName) {
            this.customerName = customerName;
            return this;
        }

        public InvoiceBuilder cargoPartnerId(Long cargoPartnerId) {
            this.cargoPartnerId = cargoPartnerId;
            return this;
        }

        public InvoiceBuilder cargoPartnerName(String cargoPartnerName) {
            this.cargoPartnerName = cargoPartnerName;
            return this;
        }

        public InvoiceBuilder pickupAddress(String pickupAddress) {
            this.pickupAddress = pickupAddress;
            return this;
        }

        public InvoiceBuilder deliveryAddress(String deliveryAddress) {
            this.deliveryAddress = deliveryAddress;
            return this;
        }

        public InvoiceBuilder cargoType(String cargoType) {
            this.cargoType = cargoType;
            return this;
        }

        public InvoiceBuilder weight(Double weight) {
            this.weight = weight;
            return this;
        }

        public InvoiceBuilder serviceType(String serviceType) {
            this.serviceType = serviceType;
            return this;
        }

        public InvoiceBuilder fare(Double fare) {
            this.fare = fare;
            return this;
        }

        public InvoiceBuilder commissionRate(Double commissionRate) {
            this.commissionRate = commissionRate;
            return this;
        }

        public InvoiceBuilder commissionAmount(Double commissionAmount) {
            this.commissionAmount = commissionAmount;
            return this;
        }

        public InvoiceBuilder partnerAmount(Double partnerAmount) {
            this.partnerAmount = partnerAmount;
            return this;
        }

        public InvoiceBuilder totalAmount(Double totalAmount) {
            this.totalAmount = totalAmount;
            return this;
        }

        public InvoiceBuilder paymentStatus(String paymentStatus) {
            this.paymentStatus = paymentStatus;
            return this;
        }

        public InvoiceBuilder invoiceDate(LocalDateTime invoiceDate) {
            this.invoiceDate = invoiceDate;
            return this;
        }

        public Invoice build() {
            Invoice instance = new Invoice();
            instance.id = this.id;
            instance.invoiceNumber = this.invoiceNumber;
            instance.shipmentId = this.shipmentId;
            instance.customerId = this.customerId;
            instance.customerName = this.customerName;
            instance.cargoPartnerId = this.cargoPartnerId;
            instance.cargoPartnerName = this.cargoPartnerName;
            instance.pickupAddress = this.pickupAddress;
            instance.deliveryAddress = this.deliveryAddress;
            instance.cargoType = this.cargoType;
            instance.weight = this.weight;
            instance.serviceType = this.serviceType;
            instance.fare = this.fare;
            instance.commissionRate = this.commissionRate;
            instance.commissionAmount = this.commissionAmount;
            instance.partnerAmount = this.partnerAmount;
            instance.totalAmount = this.totalAmount;
            instance.paymentStatus = this.paymentStatus;
            instance.invoiceDate = this.invoiceDate;
            return instance;
        }
    }

}
