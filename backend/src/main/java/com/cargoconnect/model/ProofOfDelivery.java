package com.cargoconnect.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "proof_of_delivery")
public class ProofOfDelivery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long shipmentId;

    private String enteredOtp;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String signatureData;

    private String photoUrl;
    private String notes;

    private LocalDateTime verifiedAt;

    @PrePersist
    protected void onCreate() {
        if (verifiedAt == null) verifiedAt = LocalDateTime.now();
    }


    // --- Standard Constructors ---
    public ProofOfDelivery() {}

    public ProofOfDelivery(Long id, Long shipmentId, String enteredOtp, String signatureData, String photoUrl, String notes, LocalDateTime verifiedAt) {
        this.id = id;
        this.shipmentId = shipmentId;
        this.enteredOtp = enteredOtp;
        this.signatureData = signatureData;
        this.photoUrl = photoUrl;
        this.notes = notes;
        this.verifiedAt = verifiedAt;
    }


    // --- Getters & Setters ---
    public Long getId() { return this.id; }
    public void setId(Long id) { this.id = id; }
    public Long getShipmentId() { return this.shipmentId; }
    public void setShipmentId(Long shipmentId) { this.shipmentId = shipmentId; }
    public String getEnteredOtp() { return this.enteredOtp; }
    public void setEnteredOtp(String enteredOtp) { this.enteredOtp = enteredOtp; }
    public String getSignatureData() { return this.signatureData; }
    public void setSignatureData(String signatureData) { this.signatureData = signatureData; }
    public String getPhotoUrl() { return this.photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }
    public String getNotes() { return this.notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public LocalDateTime getVerifiedAt() { return this.verifiedAt; }
    public void setVerifiedAt(LocalDateTime verifiedAt) { this.verifiedAt = verifiedAt; }


    // --- Builder Pattern ---
    public static ProofOfDeliveryBuilder builder() {
        return new ProofOfDeliveryBuilder();
    }

    public static class ProofOfDeliveryBuilder {
        private Long id;
        private Long shipmentId;
        private String enteredOtp;
        private String signatureData;
        private String photoUrl;
        private String notes;
        private LocalDateTime verifiedAt;

        public ProofOfDeliveryBuilder() {}

        public ProofOfDeliveryBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public ProofOfDeliveryBuilder shipmentId(Long shipmentId) {
            this.shipmentId = shipmentId;
            return this;
        }

        public ProofOfDeliveryBuilder enteredOtp(String enteredOtp) {
            this.enteredOtp = enteredOtp;
            return this;
        }

        public ProofOfDeliveryBuilder signatureData(String signatureData) {
            this.signatureData = signatureData;
            return this;
        }

        public ProofOfDeliveryBuilder photoUrl(String photoUrl) {
            this.photoUrl = photoUrl;
            return this;
        }

        public ProofOfDeliveryBuilder notes(String notes) {
            this.notes = notes;
            return this;
        }

        public ProofOfDeliveryBuilder verifiedAt(LocalDateTime verifiedAt) {
            this.verifiedAt = verifiedAt;
            return this;
        }

        public ProofOfDelivery build() {
            ProofOfDelivery instance = new ProofOfDelivery();
            instance.id = this.id;
            instance.shipmentId = this.shipmentId;
            instance.enteredOtp = this.enteredOtp;
            instance.signatureData = this.signatureData;
            instance.photoUrl = this.photoUrl;
            instance.notes = this.notes;
            instance.verifiedAt = this.verifiedAt;
            return instance;
        }
    }

}
