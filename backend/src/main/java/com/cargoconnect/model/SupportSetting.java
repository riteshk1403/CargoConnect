package com.cargoconnect.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "support_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupportSetting {
    public Boolean getIsActive() { return this.isActive != null ? this.isActive : false; }

    


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "primary_phone", nullable = false)
    private String primaryPhone;

    @Column(name = "secondary_phone", nullable = false)
    private String secondaryPhone;

    @Column(name = "support_email", nullable = false)
    private String supportEmail;

    @Column(name = "primary_active", nullable = false)
    @Builder.Default
    private Boolean primaryActive = true;

    @Column(name = "secondary_active", nullable = false)
    @Builder.Default
    private Boolean secondaryActive = true;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "company_name")
    @Builder.Default
    private String companyName = "CargoConnect";

    @Column(name = "company_tagline")
    @Builder.Default
    private String companyTagline = "B2B Logistics & Fleet Management";

    @Column(name = "company_description", length = 1000)
    @Builder.Default
    private String companyDescription = "Connecting businesses with verified Cargo Partners for reliable and efficient transportation across nationwide industrial freight routes.";

    @Column(name = "office_address", length = 500)
    @Builder.Default
    private String officeAddress = "CargoConnect HQ, Logistics Tech Park, Baner Road, Pune - 411045, Maharashtra, India";

    @Column(name = "support_hours")
    @Builder.Default
    private String supportHours = "Monday – Saturday: 8:00 AM – 9:00 PM IST (24/7 Emergency Dispatch Hotline)";

    @Column(name = "upi_id")
    @Builder.Default
    private String upiId = "cargoconnect@icici";

    @Column(name = "upi_holder_name")
    @Builder.Default
    private String upiHolderName = "CargoConnect Technologies Pvt Ltd";

    @Column(name = "bank_account_number")
    @Builder.Default
    private String bankAccountNumber = "002405012345";

    @Column(name = "bank_ifsc")
    @Builder.Default
    private String bankIfsc = "ICIC0000024";

    @Column(name = "bank_name")
    @Builder.Default
    private String bankName = "ICICI Bank Ltd";

    @Column(name = "updated_by")
    @Builder.Default
    private String updatedBy = "admin";


    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (primaryActive == null) primaryActive = true;
        if (secondaryActive == null) secondaryActive = true;
        if (isActive == null) isActive = true;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }


    // --- Standard Constructors ---
    public SupportSetting() {}

    public SupportSetting(Long id, String primaryPhone, String secondaryPhone, String supportEmail, Boolean primaryActive, Boolean secondaryActive, Boolean isActive, String companyName, String companyTagline, String companyDescription, String officeAddress, String supportHours, String upiId, String upiHolderName, String bankAccountNumber, String bankIfsc, String bankName, String updatedBy, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.primaryPhone = primaryPhone;
        this.secondaryPhone = secondaryPhone;
        this.supportEmail = supportEmail;
        this.primaryActive = primaryActive;
        this.secondaryActive = secondaryActive;
        this.isActive = isActive;
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
        this.updatedBy = updatedBy;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }


    // --- Getters & Setters ---
    public Long getId() { return this.id; }
    public void setId(Long id) { this.id = id; }
    public String getPrimaryPhone() { return this.primaryPhone; }
    public void setPrimaryPhone(String primaryPhone) { this.primaryPhone = primaryPhone; }
    public String getSecondaryPhone() { return this.secondaryPhone; }
    public void setSecondaryPhone(String secondaryPhone) { this.secondaryPhone = secondaryPhone; }
    public String getSupportEmail() { return this.supportEmail; }
    public void setSupportEmail(String supportEmail) { this.supportEmail = supportEmail; }
    public Boolean getPrimaryActive() { return this.primaryActive; }
    public void setPrimaryActive(Boolean primaryActive) { this.primaryActive = primaryActive; }
    public Boolean getSecondaryActive() { return this.secondaryActive; }
    public void setSecondaryActive(Boolean secondaryActive) { this.secondaryActive = secondaryActive; }
    public Boolean isActive() { return this.isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
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
    public String getUpdatedBy() { return this.updatedBy; }
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }
    public LocalDateTime getCreatedAt() { return this.createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return this.updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }


    // --- Builder Pattern ---
    public static SupportSettingBuilder builder() {
        return new SupportSettingBuilder();
    }

    public static class SupportSettingBuilder {
        private Long id;
        private String primaryPhone;
        private String secondaryPhone;
        private String supportEmail;
        private Boolean primaryActive;
        private Boolean secondaryActive;
        private Boolean isActive;
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
        private String updatedBy;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public SupportSettingBuilder() {}

        public SupportSettingBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public SupportSettingBuilder primaryPhone(String primaryPhone) {
            this.primaryPhone = primaryPhone;
            return this;
        }

        public SupportSettingBuilder secondaryPhone(String secondaryPhone) {
            this.secondaryPhone = secondaryPhone;
            return this;
        }

        public SupportSettingBuilder supportEmail(String supportEmail) {
            this.supportEmail = supportEmail;
            return this;
        }

        public SupportSettingBuilder primaryActive(Boolean primaryActive) {
            this.primaryActive = primaryActive;
            return this;
        }

        public SupportSettingBuilder secondaryActive(Boolean secondaryActive) {
            this.secondaryActive = secondaryActive;
            return this;
        }

        public SupportSettingBuilder isActive(Boolean isActive) {
            this.isActive = isActive;
            return this;
        }

        public SupportSettingBuilder companyName(String companyName) {
            this.companyName = companyName;
            return this;
        }

        public SupportSettingBuilder companyTagline(String companyTagline) {
            this.companyTagline = companyTagline;
            return this;
        }

        public SupportSettingBuilder companyDescription(String companyDescription) {
            this.companyDescription = companyDescription;
            return this;
        }

        public SupportSettingBuilder officeAddress(String officeAddress) {
            this.officeAddress = officeAddress;
            return this;
        }

        public SupportSettingBuilder supportHours(String supportHours) {
            this.supportHours = supportHours;
            return this;
        }

        public SupportSettingBuilder upiId(String upiId) {
            this.upiId = upiId;
            return this;
        }

        public SupportSettingBuilder upiHolderName(String upiHolderName) {
            this.upiHolderName = upiHolderName;
            return this;
        }

        public SupportSettingBuilder bankAccountNumber(String bankAccountNumber) {
            this.bankAccountNumber = bankAccountNumber;
            return this;
        }

        public SupportSettingBuilder bankIfsc(String bankIfsc) {
            this.bankIfsc = bankIfsc;
            return this;
        }

        public SupportSettingBuilder bankName(String bankName) {
            this.bankName = bankName;
            return this;
        }

        public SupportSettingBuilder updatedBy(String updatedBy) {
            this.updatedBy = updatedBy;
            return this;
        }

        public SupportSettingBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public SupportSettingBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public SupportSetting build() {
            SupportSetting instance = new SupportSetting();
            instance.id = this.id;
            instance.primaryPhone = this.primaryPhone;
            instance.secondaryPhone = this.secondaryPhone;
            instance.supportEmail = this.supportEmail;
            instance.primaryActive = this.primaryActive;
            instance.secondaryActive = this.secondaryActive;
            instance.isActive = this.isActive;
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
            instance.updatedBy = this.updatedBy;
            instance.createdAt = this.createdAt;
            instance.updatedAt = this.updatedAt;
            return instance;
        }
    }

}
