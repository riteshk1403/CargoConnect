package com.cargoconnect.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {
    public enum PaymentMethod {
        ONLINE,
        COD,
        CORPORATE_CREDIT
    }

    public enum Status {
        PENDING,
        PAID,
        FAILED,
        REFUNDED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long shipmentId;

    @Column(nullable = false)
    private Double amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    private String transactionId;
    private LocalDateTime invoiceDate;

    @PrePersist
    protected void onCreate() {
        if (invoiceDate == null) invoiceDate = LocalDateTime.now();
    }
}
