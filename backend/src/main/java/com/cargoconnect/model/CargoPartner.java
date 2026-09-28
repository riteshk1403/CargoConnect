package com.cargoconnect.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "cargo_partners")
public class CargoPartner {
    public enum VerificationStatus {
        PENDING,
        VERIFIED,
        REJECTED
    }

    public enum Status {
        ACTIVE,
        INACTIVE
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String companyName;

    private String ownerName;

    @Column(unique = true, nullable = false)
    private String email;

    private String phone;
    private String address;

        private String city = "Pune";

        private Double latitude = 18.5362; // Default Pune (Pashan area)

        private Double longitude = 73.7929;

        private Double rating = 5.0;

        private int totalTrips = 0;

    @Enumerated(EnumType.STRING)
        private VerificationStatus verificationStatus = VerificationStatus.VERIFIED;

    @Enumerated(EnumType.STRING)
        private Status status = Status.ACTIVE;

    private String rejectionReason;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

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
    public CargoPartner() {}

    public CargoPartner(Long id, String companyName, String ownerName, String email, String phone, String address, String city, Double latitude, Double longitude, Double rating, int totalTrips, VerificationStatus verificationStatus, Status status, String rejectionReason, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.companyName = companyName;
        this.ownerName = ownerName;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.city = city;
        this.latitude = latitude;
        this.longitude = longitude;
        this.rating = rating;
        this.totalTrips = totalTrips;
        this.verificationStatus = verificationStatus;
        this.status = status;
        this.rejectionReason = rejectionReason;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }


    // --- Getters & Setters ---
    public Long getId() { return this.id; }
    public void setId(Long id) { this.id = id; }
    public String getCompanyName() { return this.companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getOwnerName() { return this.ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }
    public String getEmail() { return this.email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return this.phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getAddress() { return this.address; }
    public void setAddress(String address) { this.address = address; }
    public String getCity() { return this.city; }
    public void setCity(String city) { this.city = city; }
    public Double getLatitude() { return this.latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return this.longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public Double getRating() { return this.rating; }
    public void setRating(Double rating) { this.rating = rating; }
    public int getTotalTrips() { return this.totalTrips; }
    public void setTotalTrips(int totalTrips) { this.totalTrips = totalTrips; }
    public VerificationStatus getVerificationStatus() { return this.verificationStatus; }
    public void setVerificationStatus(VerificationStatus verificationStatus) { this.verificationStatus = verificationStatus; }
    public Status getStatus() { return this.status; }
    public void setStatus(Status status) { this.status = status; }
    public String getRejectionReason() { return this.rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
    public LocalDateTime getCreatedAt() { return this.createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return this.updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }


    // --- Builder Pattern ---
    public static CargoPartnerBuilder builder() {
        return new CargoPartnerBuilder();
    }

    public static class CargoPartnerBuilder {
        private Long id;
        private String companyName;
        private String ownerName;
        private String email;
        private String phone;
        private String address;
        private String city;
        private Double latitude;
        private Double longitude;
        private Double rating;
        private int totalTrips;
        private VerificationStatus verificationStatus;
        private Status status;
        private String rejectionReason;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public CargoPartnerBuilder() {}

        public CargoPartnerBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public CargoPartnerBuilder companyName(String companyName) {
            this.companyName = companyName;
            return this;
        }

        public CargoPartnerBuilder ownerName(String ownerName) {
            this.ownerName = ownerName;
            return this;
        }

        public CargoPartnerBuilder email(String email) {
            this.email = email;
            return this;
        }

        public CargoPartnerBuilder phone(String phone) {
            this.phone = phone;
            return this;
        }

        public CargoPartnerBuilder address(String address) {
            this.address = address;
            return this;
        }

        public CargoPartnerBuilder city(String city) {
            this.city = city;
            return this;
        }

        public CargoPartnerBuilder latitude(Double latitude) {
            this.latitude = latitude;
            return this;
        }

        public CargoPartnerBuilder longitude(Double longitude) {
            this.longitude = longitude;
            return this;
        }

        public CargoPartnerBuilder rating(Double rating) {
            this.rating = rating;
            return this;
        }

        public CargoPartnerBuilder totalTrips(int totalTrips) {
            this.totalTrips = totalTrips;
            return this;
        }

        public CargoPartnerBuilder verificationStatus(VerificationStatus verificationStatus) {
            this.verificationStatus = verificationStatus;
            return this;
        }

        public CargoPartnerBuilder status(Status status) {
            this.status = status;
            return this;
        }

        public CargoPartnerBuilder rejectionReason(String rejectionReason) {
            this.rejectionReason = rejectionReason;
            return this;
        }

        public CargoPartnerBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public CargoPartnerBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public CargoPartner build() {
            CargoPartner instance = new CargoPartner();
            instance.id = this.id;
            instance.companyName = this.companyName;
            instance.ownerName = this.ownerName;
            instance.email = this.email;
            instance.phone = this.phone;
            instance.address = this.address;
            instance.city = this.city;
            instance.latitude = this.latitude;
            instance.longitude = this.longitude;
            instance.rating = this.rating;
            instance.totalTrips = this.totalTrips;
            instance.verificationStatus = this.verificationStatus;
            instance.status = this.status;
            instance.rejectionReason = this.rejectionReason;
            instance.createdAt = this.createdAt;
            instance.updatedAt = this.updatedAt;
            return instance;
        }
    }

}
