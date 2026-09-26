package com.cargoconnect.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "drivers",
       indexes = {
           @Index(name = "idx_driver_partner", columnList = "cargoPartnerId")
       })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Driver {
    public enum Status {
        AVAILABLE,
        ASSIGNED,
        UNAVAILABLE
    }

    public enum VerificationStatus {
        PENDING,
        VERIFIED,
        REJECTED,
        EXPIRED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long cargoPartnerId; // Linked Cargo Partner

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String licenseNumber;

    private LocalDate licenseExpiryDate;
    private String phone;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Status status = Status.AVAILABLE;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private VerificationStatus verificationStatus = VerificationStatus.VERIFIED;

    private String rejectionReason;

    @Builder.Default
    private Double latitude = 18.5362;

    @Builder.Default
    private Double longitude = 73.7929;

    private String activeShipmentId;

    @Builder.Default
    private Double rating = 5.0;

    @Builder.Default
    private int totalRatings = 0;

    @Builder.Default
    private int totalDeliveries = 0;


    // --- Standard Constructors ---
    public Driver() {}

    public Driver(Long id, Long cargoPartnerId, String name, String licenseNumber, LocalDate licenseExpiryDate, String phone, Status status, VerificationStatus verificationStatus, String rejectionReason, Double latitude, Double longitude, String activeShipmentId, Double rating, int totalRatings, int totalDeliveries) {
        this.id = id;
        this.cargoPartnerId = cargoPartnerId;
        this.name = name;
        this.licenseNumber = licenseNumber;
        this.licenseExpiryDate = licenseExpiryDate;
        this.phone = phone;
        this.status = status;
        this.verificationStatus = verificationStatus;
        this.rejectionReason = rejectionReason;
        this.latitude = latitude;
        this.longitude = longitude;
        this.activeShipmentId = activeShipmentId;
        this.rating = rating;
        this.totalRatings = totalRatings;
        this.totalDeliveries = totalDeliveries;
    }


    // --- Getters & Setters ---
    public Long getId() { return this.id; }
    public void setId(Long id) { this.id = id; }
    public Long getCargoPartnerId() { return this.cargoPartnerId; }
    public void setCargoPartnerId(Long cargoPartnerId) { this.cargoPartnerId = cargoPartnerId; }
    public String getName() { return this.name; }
    public void setName(String name) { this.name = name; }
    public String getLicenseNumber() { return this.licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }
    public LocalDate getLicenseExpiryDate() { return this.licenseExpiryDate; }
    public void setLicenseExpiryDate(LocalDate licenseExpiryDate) { this.licenseExpiryDate = licenseExpiryDate; }
    public String getPhone() { return this.phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public Status getStatus() { return this.status; }
    public void setStatus(Status status) { this.status = status; }
    public VerificationStatus getVerificationStatus() { return this.verificationStatus; }
    public void setVerificationStatus(VerificationStatus verificationStatus) { this.verificationStatus = verificationStatus; }
    public String getRejectionReason() { return this.rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
    public Double getLatitude() { return this.latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return this.longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public String getActiveShipmentId() { return this.activeShipmentId; }
    public void setActiveShipmentId(String activeShipmentId) { this.activeShipmentId = activeShipmentId; }
    public Double getRating() { return this.rating; }
    public void setRating(Double rating) { this.rating = rating; }
    public int getTotalRatings() { return this.totalRatings; }
    public void setTotalRatings(int totalRatings) { this.totalRatings = totalRatings; }
    public int getTotalDeliveries() { return this.totalDeliveries; }
    public void setTotalDeliveries(int totalDeliveries) { this.totalDeliveries = totalDeliveries; }


    // --- Builder Pattern ---
    public static DriverBuilder builder() {
        return new DriverBuilder();
    }

    public static class DriverBuilder {
        private Long id;
        private Long cargoPartnerId;
        private String name;
        private String licenseNumber;
        private LocalDate licenseExpiryDate;
        private String phone;
        private Status status;
        private VerificationStatus verificationStatus;
        private String rejectionReason;
        private Double latitude;
        private Double longitude;
        private String activeShipmentId;
        private Double rating;
        private int totalRatings;
        private int totalDeliveries;

        public DriverBuilder() {}

        public DriverBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public DriverBuilder cargoPartnerId(Long cargoPartnerId) {
            this.cargoPartnerId = cargoPartnerId;
            return this;
        }

        public DriverBuilder name(String name) {
            this.name = name;
            return this;
        }

        public DriverBuilder licenseNumber(String licenseNumber) {
            this.licenseNumber = licenseNumber;
            return this;
        }

        public DriverBuilder licenseExpiryDate(LocalDate licenseExpiryDate) {
            this.licenseExpiryDate = licenseExpiryDate;
            return this;
        }

        public DriverBuilder phone(String phone) {
            this.phone = phone;
            return this;
        }

        public DriverBuilder status(Status status) {
            this.status = status;
            return this;
        }

        public DriverBuilder verificationStatus(VerificationStatus verificationStatus) {
            this.verificationStatus = verificationStatus;
            return this;
        }

        public DriverBuilder rejectionReason(String rejectionReason) {
            this.rejectionReason = rejectionReason;
            return this;
        }

        public DriverBuilder latitude(Double latitude) {
            this.latitude = latitude;
            return this;
        }

        public DriverBuilder longitude(Double longitude) {
            this.longitude = longitude;
            return this;
        }

        public DriverBuilder activeShipmentId(String activeShipmentId) {
            this.activeShipmentId = activeShipmentId;
            return this;
        }

        public DriverBuilder rating(Double rating) {
            this.rating = rating;
            return this;
        }

        public DriverBuilder totalRatings(int totalRatings) {
            this.totalRatings = totalRatings;
            return this;
        }

        public DriverBuilder totalDeliveries(int totalDeliveries) {
            this.totalDeliveries = totalDeliveries;
            return this;
        }

        public Driver build() {
            Driver instance = new Driver();
            instance.id = this.id;
            instance.cargoPartnerId = this.cargoPartnerId;
            instance.name = this.name;
            instance.licenseNumber = this.licenseNumber;
            instance.licenseExpiryDate = this.licenseExpiryDate;
            instance.phone = this.phone;
            instance.status = this.status;
            instance.verificationStatus = this.verificationStatus;
            instance.rejectionReason = this.rejectionReason;
            instance.latitude = this.latitude;
            instance.longitude = this.longitude;
            instance.activeShipmentId = this.activeShipmentId;
            instance.rating = this.rating;
            instance.totalRatings = this.totalRatings;
            instance.totalDeliveries = this.totalDeliveries;
            return instance;
        }
    }

}
