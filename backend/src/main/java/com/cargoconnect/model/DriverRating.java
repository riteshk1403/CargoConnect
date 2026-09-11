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
}
