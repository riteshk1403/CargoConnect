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


    // --- Standard Constructors ---
    public Payment() {}

    public Payment(Long id, Long shipmentId, Double amount, PaymentMethod paymentMethod, Status status, String transactionId, LocalDateTime invoiceDate) {
        this.id = id;
        this.shipmentId = shipmentId;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.status = status;
        this.transactionId = transactionId;
        this.invoiceDate = invoiceDate;
    }


    // --- Getters & Setters ---
    public Long getId() { return this.id; }
    public void setId(Long id) { this.id = id; }
    public Long getShipmentId() { return this.shipmentId; }
    public void setShipmentId(Long shipmentId) { this.shipmentId = shipmentId; }
    public Double getAmount() { return this.amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public PaymentMethod getPaymentMethod() { return this.paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }
    public Status getStatus() { return this.status; }
    public void setStatus(Status status) { this.status = status; }
    public String getTransactionId() { return this.transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
    public LocalDateTime getInvoiceDate() { return this.invoiceDate; }
    public void setInvoiceDate(LocalDateTime invoiceDate) { this.invoiceDate = invoiceDate; }


    // --- Builder Pattern ---
    public static PaymentBuilder builder() {
        return new PaymentBuilder();
    }

    public static class PaymentBuilder {
        private Long id;
        private Long shipmentId;
        private Double amount;
        private PaymentMethod paymentMethod;
        private Status status;
        private String transactionId;
        private LocalDateTime invoiceDate;

        public PaymentBuilder() {}

        public PaymentBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public PaymentBuilder shipmentId(Long shipmentId) {
            this.shipmentId = shipmentId;
            return this;
        }

        public PaymentBuilder amount(Double amount) {
            this.amount = amount;
            return this;
        }

        public PaymentBuilder paymentMethod(PaymentMethod paymentMethod) {
            this.paymentMethod = paymentMethod;
            return this;
        }

        public PaymentBuilder status(Status status) {
            this.status = status;
            return this;
        }

        public PaymentBuilder transactionId(String transactionId) {
            this.transactionId = transactionId;
            return this;
        }

        public PaymentBuilder invoiceDate(LocalDateTime invoiceDate) {
            this.invoiceDate = invoiceDate;
            return this;
        }

        public Payment build() {
            Payment instance = new Payment();
            instance.id = this.id;
            instance.shipmentId = this.shipmentId;
            instance.amount = this.amount;
            instance.paymentMethod = this.paymentMethod;
            instance.status = this.status;
            instance.transactionId = this.transactionId;
            instance.invoiceDate = this.invoiceDate;
            return instance;
        }
    }

}
