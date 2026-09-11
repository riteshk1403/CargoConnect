package com.cargoconnect.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "commission_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommissionSetting {
    public enum CommissionType {
        PERCENTAGE
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private CommissionType commissionType = CommissionType.PERCENTAGE;

    @Builder.Default
    private Double commissionRate = 10.0; // Default 10%

    @Builder.Default
    private String updatedBy = "admin";

    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onSave() {
        updatedAt = LocalDateTime.now();
    }
}
