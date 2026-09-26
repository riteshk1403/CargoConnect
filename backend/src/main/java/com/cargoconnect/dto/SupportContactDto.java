package com.cargoconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupportContactDto {
    private Long id;
    private String label;
    private String phoneNumber;
    private Boolean isActive;
    private Integer displayOrder;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;


    // --- Standard Constructors ---
    public SupportContactDto() {}

    public SupportContactDto(Long id, String label, String phoneNumber, Boolean isActive, Integer displayOrder, LocalDateTime createdAt, LocalDateTime updatedAt) {
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
    public static SupportContactDtoBuilder builder() {
        return new SupportContactDtoBuilder();
    }

    public static class SupportContactDtoBuilder {
        private Long id;
        private String label;
        private String phoneNumber;
        private Boolean isActive;
        private Integer displayOrder;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public SupportContactDtoBuilder() {}

        public SupportContactDtoBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public SupportContactDtoBuilder label(String label) {
            this.label = label;
            return this;
        }

        public SupportContactDtoBuilder phoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
            return this;
        }

        public SupportContactDtoBuilder isActive(Boolean isActive) {
            this.isActive = isActive;
            return this;
        }

        public SupportContactDtoBuilder displayOrder(Integer displayOrder) {
            this.displayOrder = displayOrder;
            return this;
        }

        public SupportContactDtoBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public SupportContactDtoBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public SupportContactDto build() {
            SupportContactDto instance = new SupportContactDto();
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
