package com.cargoconnect.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "driver_ratings", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"shipmentId"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverRating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long shipmentId;

    @Column(nullable = false)
    private Long driverId;

    private Long customerId;

    @Column(nullable = false)
    private Integer rating; // 1 to 5 stars

    @Column(columnDefinition = "TEXT")
    private String feedback;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }


    // --- Standard Constructors ---
    public DriverRating() {}

    public DriverRating(Long id, Long shipmentId, Long driverId, Long customerId, Integer rating, String feedback, LocalDateTime createdAt) {
        this.id = id;
        this.shipmentId = shipmentId;
        this.driverId = driverId;
        this.customerId = customerId;
        this.rating = rating;
        this.feedback = feedback;
        this.createdAt = createdAt;
    }


    // --- Getters & Setters ---
    public Long getId() { return this.id; }
    public void setId(Long id) { this.id = id; }
    public Long getShipmentId() { return this.shipmentId; }
    public void setShipmentId(Long shipmentId) { this.shipmentId = shipmentId; }
    public Long getDriverId() { return this.driverId; }
    public void setDriverId(Long driverId) { this.driverId = driverId; }
    public Long getCustomerId() { return this.customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public Integer getRating() { return this.rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    public String getFeedback() { return this.feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
    public LocalDateTime getCreatedAt() { return this.createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }


    // --- Builder Pattern ---
    public static DriverRatingBuilder builder() {
        return new DriverRatingBuilder();
    }

    public static class DriverRatingBuilder {
        private Long id;
        private Long shipmentId;
        private Long driverId;
        private Long customerId;
        private Integer rating;
        private String feedback;
        private LocalDateTime createdAt;

        public DriverRatingBuilder() {}

        public DriverRatingBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public DriverRatingBuilder shipmentId(Long shipmentId) {
            this.shipmentId = shipmentId;
            return this;
        }

        public DriverRatingBuilder driverId(Long driverId) {
            this.driverId = driverId;
            return this;
        }

        public DriverRatingBuilder customerId(Long customerId) {
            this.customerId = customerId;
            return this;
        }

        public DriverRatingBuilder rating(Integer rating) {
            this.rating = rating;
            return this;
        }

        public DriverRatingBuilder feedback(String feedback) {
            this.feedback = feedback;
            return this;
        }

        public DriverRatingBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public DriverRating build() {
            DriverRating instance = new DriverRating();
            instance.id = this.id;
            instance.shipmentId = this.shipmentId;
            instance.driverId = this.driverId;
            instance.customerId = this.customerId;
            instance.rating = this.rating;
            instance.feedback = this.feedback;
            instance.createdAt = this.createdAt;
            return instance;
        }
    }

}
