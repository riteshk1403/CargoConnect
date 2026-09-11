package com.cargoconnect.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "invoices")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
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
}
