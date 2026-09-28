package com.cargoconnect.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "support_contacts")
public class SupportContact {
    public Boolean getIsActive() { return this.isActive != null ? this.isActive : false; }

    


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "label", nullable = false)
    private String label;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @Column(name = "is_active", nullable = false)
        private Boolean isActive = true;

    @Column(name = "display_order")
        private Integer displayOrder = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (isActive == null) isActive = true;
        if (displayOrder == null) displayOrder = 0;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }


    // --- Standard Constructors ---
    public SupportContact() {}

    public SupportContact(Long id, String label, String phoneNumber, Boolean isActive, Integer displayOrder, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.label = label;
        this.phoneNumber = phoneNumber;
        this.isActive = isActive;
        this.displayOrder = displayOrder;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }


    // --- Getters & Setters ---
    public Long getId() { return this.id; }
    public void setId(Long id) { this.id = id; }
    public String getLabel() { return this.label; }
    public void setLabel(String label) { this.label = label; }
    public String getPhoneNumber() { return this.phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public Boolean isActive() { return this.isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    public Integer getDisplayOrder() { return this.displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
    public LocalDateTime getCreatedAt() { return this.createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return this.updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }


    // --- Builder Pattern ---
    public static SupportContactBuilder builder() {
        return new SupportContactBuilder();
    }

    public static class SupportContactBuilder {
        private Long id;
        private String label;
        private String phoneNumber;
        private Boolean isActive;
        private Integer displayOrder;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public SupportContactBuilder() {}

        public SupportContactBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public SupportContactBuilder label(String label) {
            this.label = label;
            return this;
        }

        public SupportContactBuilder phoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
            return this;
        }

        public SupportContactBuilder isActive(Boolean isActive) {
            this.isActive = isActive;
            return this;
        }

        public SupportContactBuilder displayOrder(Integer displayOrder) {
            this.displayOrder = displayOrder;
            return this;
        }

        public SupportContactBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public SupportContactBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public SupportContact build() {
            SupportContact instance = new SupportContact();
            instance.id = this.id;
            instance.label = this.label;
            instance.phoneNumber = this.phoneNumber;
            instance.isActive = this.isActive;
            instance.displayOrder = this.displayOrder;
            instance.createdAt = this.createdAt;
            instance.updatedAt = this.updatedAt;
            return instance;
        }
    }

}
