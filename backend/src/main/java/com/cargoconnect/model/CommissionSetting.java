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


    // --- Standard Constructors ---
    public CommissionSetting() {}

    public CommissionSetting(Long id, CommissionType commissionType, Double commissionRate, String updatedBy, LocalDateTime updatedAt) {
        this.id = id;
        this.commissionType = commissionType;
        this.commissionRate = commissionRate;
        this.updatedBy = updatedBy;
        this.updatedAt = updatedAt;
    }


    // --- Getters & Setters ---
    public Long getId() { return this.id; }
    public void setId(Long id) { this.id = id; }
    public CommissionType getCommissionType() { return this.commissionType; }
    public void setCommissionType(CommissionType commissionType) { this.commissionType = commissionType; }
    public Double getCommissionRate() { return this.commissionRate; }
    public void setCommissionRate(Double commissionRate) { this.commissionRate = commissionRate; }
    public String getUpdatedBy() { return this.updatedBy; }
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }
    public LocalDateTime getUpdatedAt() { return this.updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }


    // --- Builder Pattern ---
    public static CommissionSettingBuilder builder() {
        return new CommissionSettingBuilder();
    }

    public static class CommissionSettingBuilder {
        private Long id;
        private CommissionType commissionType;
        private Double commissionRate;
        private String updatedBy;
        private LocalDateTime updatedAt;

        public CommissionSettingBuilder() {}

        public CommissionSettingBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public CommissionSettingBuilder commissionType(CommissionType commissionType) {
            this.commissionType = commissionType;
            return this;
        }

        public CommissionSettingBuilder commissionRate(Double commissionRate) {
            this.commissionRate = commissionRate;
            return this;
        }

        public CommissionSettingBuilder updatedBy(String updatedBy) {
            this.updatedBy = updatedBy;
            return this;
        }

        public CommissionSettingBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public CommissionSetting build() {
            CommissionSetting instance = new CommissionSetting();
            instance.id = this.id;
            instance.commissionType = this.commissionType;
            instance.commissionRate = this.commissionRate;
            instance.updatedBy = this.updatedBy;
            instance.updatedAt = this.updatedAt;
            return instance;
        }
    }

}
