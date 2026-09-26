package com.cargoconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupportContactsResponseDto {
    private String supportEmail;
    private List<SupportContactDto> contacts;
    private long totalActiveContacts;

    // Company Information
    private String companyName;
    private String companyTagline;
    private String companyDescription;
    private String officeAddress;
    private String supportHours;
    private String upiId;
    private String upiHolderName;
    private String bankAccountNumber;
    private String bankIfsc;
    private String bankName;


    // Legacy fields for backward compatibility
    private String primaryPhone;
    private String secondaryPhone;
    private Boolean primaryActive;
    private Boolean secondaryActive;
    private Boolean isActive;
    private LocalDateTime updatedAt;


    // --- Standard Constructors ---
    public SupportContactsResponseDto() {}

    public SupportContactsResponseDto(String supportEmail, List<SupportContactDto> contacts, long totalActiveContacts, String companyName, String companyTagline, String companyDescription, String officeAddress, String supportHours, String upiId, String upiHolderName, String bankAccountNumber, String bankIfsc, String bankName, String primaryPhone, String secondaryPhone, Boolean primaryActive, Boolean secondaryActive, Boolean isActive, LocalDateTime updatedAt) {
        this.supportEmail = supportEmail;
        this.contacts = contacts;
        this.totalActiveContacts = totalActiveContacts;
        this.companyName = companyName;
        this.companyTagline = companyTagline;
        this.companyDescription = companyDescription;
        this.officeAddress = officeAddress;
        this.supportHours = supportHours;
        this.upiId = upiId;
        this.upiHolderName = upiHolderName;
        this.bankAccountNumber = bankAccountNumber;
        this.bankIfsc = bankIfsc;
        this.bankName = bankName;
        this.primaryPhone = primaryPhone;
        this.secondaryPhone = secondaryPhone;
        this.primaryActive = primaryActive;
        this.secondaryActive = secondaryActive;
        this.isActive = isActive;
        this.updatedAt = updatedAt;
    }


    // --- Getters & Setters ---
    public String getSupportEmail() { return this.supportEmail; }
    public void setSupportEmail(String supportEmail) { this.supportEmail = supportEmail; }
    public List<SupportContactDto> getContacts() { return this.contacts; }
    public void setContacts(List<SupportContactDto> contacts) { this.contacts = contacts; }
    public long getTotalActiveContacts() { return this.totalActiveContacts; }
    public void setTotalActiveContacts(long totalActiveContacts) { this.totalActiveContacts = totalActiveContacts; }
    public String getCompanyName() { return this.companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getCompanyTagline() { return this.companyTagline; }
    public void setCompanyTagline(String companyTagline) { this.companyTagline = companyTagline; }
    public String getCompanyDescription() { return this.companyDescription; }
    public void setCompanyDescription(String companyDescription) { this.companyDescription = companyDescription; }
    public String getOfficeAddress() { return this.officeAddress; }
    public void setOfficeAddress(String officeAddress) { this.officeAddress = officeAddress; }
    public String getSupportHours() { return this.supportHours; }
    public void setSupportHours(String supportHours) { this.supportHours = supportHours; }
    public String getUpiId() { return this.upiId; }
    public void setUpiId(String upiId) { this.upiId = upiId; }
    public String getUpiHolderName() { return this.upiHolderName; }
    public void setUpiHolderName(String upiHolderName) { this.upiHolderName = upiHolderName; }
    public String getBankAccountNumber() { return this.bankAccountNumber; }
    public void setBankAccountNumber(String bankAccountNumber) { this.bankAccountNumber = bankAccountNumber; }
    public String getBankIfsc() { return this.bankIfsc; }
    public void setBankIfsc(String bankIfsc) { this.bankIfsc = bankIfsc; }
    public String getBankName() { return this.bankName; }
    public void setBankName(String bankName) { this.bankName = bankName; }
    public String getPrimaryPhone() { return this.primaryPhone; }
    public void setPrimaryPhone(String primaryPhone) { this.primaryPhone = primaryPhone; }
    public String getSecondaryPhone() { return this.secondaryPhone; }
    public void setSecondaryPhone(String secondaryPhone) { this.secondaryPhone = secondaryPhone; }
    public Boolean getPrimaryActive() { return this.primaryActive; }
    public void setPrimaryActive(Boolean primaryActive) { this.primaryActive = primaryActive; }
    public Boolean getSecondaryActive() { return this.secondaryActive; }
    public void setSecondaryActive(Boolean secondaryActive) { this.secondaryActive = secondaryActive; }
    public Boolean isActive() { return this.isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    public LocalDateTime getUpdatedAt() { return this.updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }


    // --- Builder Pattern ---
    public static SupportContactsResponseDtoBuilder builder() {
        return new SupportContactsResponseDtoBuilder();
    }

    public static class SupportContactsResponseDtoBuilder {
        private String supportEmail;
        private List<SupportContactDto> contacts;
        private long totalActiveContacts;
        private String companyName;
        private String companyTagline;
        private String companyDescription;
        private String officeAddress;
        private String supportHours;
        private String upiId;
        private String upiHolderName;
        private String bankAccountNumber;
        private String bankIfsc;
        private String bankName;
        private String primaryPhone;
        private String secondaryPhone;
        private Boolean primaryActive;
        private Boolean secondaryActive;
        private Boolean isActive;
        private LocalDateTime updatedAt;

        public SupportContactsResponseDtoBuilder() {}

        public SupportContactsResponseDtoBuilder supportEmail(String supportEmail) {
            this.supportEmail = supportEmail;
            return this;
        }

        public SupportContactsResponseDtoBuilder contacts(List<SupportContactDto> contacts) {
            this.contacts = contacts;
            return this;
        }

        public SupportContactsResponseDtoBuilder totalActiveContacts(long totalActiveContacts) {
            this.totalActiveContacts = totalActiveContacts;
            return this;
        }

        public SupportContactsResponseDtoBuilder companyName(String companyName) {
            this.companyName = companyName;
            return this;
        }

        public SupportContactsResponseDtoBuilder companyTagline(String companyTagline) {
            this.companyTagline = companyTagline;
            return this;
        }

        public SupportContactsResponseDtoBuilder companyDescription(String companyDescription) {
            this.companyDescription = companyDescription;
            return this;
        }

        public SupportContactsResponseDtoBuilder officeAddress(String officeAddress) {
            this.officeAddress = officeAddress;
            return this;
        }

        public SupportContactsResponseDtoBuilder supportHours(String supportHours) {
            this.supportHours = supportHours;
            return this;
        }

        public SupportContactsResponseDtoBuilder upiId(String upiId) {
            this.upiId = upiId;
            return this;
        }

        public SupportContactsResponseDtoBuilder upiHolderName(String upiHolderName) {
            this.upiHolderName = upiHolderName;
            return this;
        }

        public SupportContactsResponseDtoBuilder bankAccountNumber(String bankAccountNumber) {
            this.bankAccountNumber = bankAccountNumber;
            return this;
        }

        public SupportContactsResponseDtoBuilder bankIfsc(String bankIfsc) {
            this.bankIfsc = bankIfsc;
            return this;
        }

        public SupportContactsResponseDtoBuilder bankName(String bankName) {
            this.bankName = bankName;
            return this;
        }

        public SupportContactsResponseDtoBuilder primaryPhone(String primaryPhone) {
            this.primaryPhone = primaryPhone;
            return this;
        }

        public SupportContactsResponseDtoBuilder secondaryPhone(String secondaryPhone) {
            this.secondaryPhone = secondaryPhone;
            return this;
        }

        public SupportContactsResponseDtoBuilder primaryActive(Boolean primaryActive) {
            this.primaryActive = primaryActive;
            return this;
        }

        public SupportContactsResponseDtoBuilder secondaryActive(Boolean secondaryActive) {
            this.secondaryActive = secondaryActive;
            return this;
        }

        public SupportContactsResponseDtoBuilder isActive(Boolean isActive) {
            this.isActive = isActive;
            return this;
        }

        public SupportContactsResponseDtoBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public SupportContactsResponseDto build() {
            SupportContactsResponseDto instance = new SupportContactsResponseDto();
            instance.supportEmail = this.supportEmail;
            instance.contacts = this.contacts;
            instance.totalActiveContacts = this.totalActiveContacts;
            instance.companyName = this.companyName;
            instance.companyTagline = this.companyTagline;
            instance.companyDescription = this.companyDescription;
            instance.officeAddress = this.officeAddress;
            instance.supportHours = this.supportHours;
            instance.upiId = this.upiId;
            instance.upiHolderName = this.upiHolderName;
            instance.bankAccountNumber = this.bankAccountNumber;
            instance.bankIfsc = this.bankIfsc;
            instance.bankName = this.bankName;
            instance.primaryPhone = this.primaryPhone;
            instance.secondaryPhone = this.secondaryPhone;
            instance.primaryActive = this.primaryActive;
            instance.secondaryActive = this.secondaryActive;
            instance.isActive = this.isActive;
            instance.updatedAt = this.updatedAt;
            return instance;
        }
    }

}
