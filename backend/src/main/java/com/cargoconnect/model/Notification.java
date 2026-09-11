package com.cargoconnect.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId; // target user id (or null for all in role)
    private String role;   // e.g. "ROLE_SHIPPER", "ROLE_DRIVER", "ROLE_ADMIN"

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Builder.Default
    private String type = "INFO"; // INFO, SUCCESS, WARNING, ALERT

    @Builder.Default
    private boolean readStatus = false;

    private String linkUrl;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }
}
