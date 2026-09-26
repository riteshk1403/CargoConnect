package com.cargoconnect.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupportCompanyInfoRequest {

    @NotBlank(message = "Company name is required")
    private String companyName;

    private String companyTagline;

    private String companyDescription;

    @NotBlank(message = "Office address is required")
    private String officeAddress;

    @NotBlank(message = "Support hours are required")
    private String supportHours;

    private String supportEmail;

    private String upiId;

    private String upiHolderName;

    private String bankAccountNumber;

    private String bankIfsc;

    private String bankName;



    // --- Standard Constructors ---
    public SupportCompanyInfoRequest() {}

    public SupportCompanyInfoRequest(String companyName, String companyTagline, String companyDescription, String officeAddress, String supportHours, String supportEmail, String upiId, String upiHolderName, String bankAccountNumber, String bankIfsc, String bankName) {
        this.companyName = companyName;
        this.companyTagline = companyTagline;
        this.companyDescription = companyDescription;
        this.officeAddress = officeAddress;
        this.supportHours = supportHours;
        this.supportEmail = supportEmail;
        this.upiId = upiId;
        this.upiHolderName = upiHolderName;
        this.bankAccountNumber = bankAccountNumber;
        this.bankIfsc = bankIfsc;
        this.bankName = bankName;
    }


    // --- Getters & Setters ---
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
    public String getSupportEmail() { return this.supportEmail; }
    public void setSupportEmail(String supportEmail) { this.supportEmail = supportEmail; }
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


    // --- Builder Pattern ---
    public static SupportCompanyInfoRequestBuilder builder() {
        return new SupportCompanyInfoRequestBuilder();
    }

    public static class SupportCompanyInfoRequestBuilder {
        private String companyName;
        private String companyTagline;
        private String companyDescription;
        private String officeAddress;
        private String supportHours;
        private String supportEmail;
        private String upiId;
        private String upiHolderName;
        private String bankAccountNumber;
        private String bankIfsc;
        private String bankName;

        public SupportCompanyInfoRequestBuilder() {}

        public SupportCompanyInfoRequestBuilder companyName(String companyName) {
            this.companyName = companyName;
            return this;
        }

        public SupportCompanyInfoRequestBuilder companyTagline(String companyTagline) {
            this.companyTagline = companyTagline;
            return this;
        }

        public SupportCompanyInfoRequestBuilder companyDescription(String companyDescription) {
            this.companyDescription = companyDescription;
            return this;
        }

        public SupportCompanyInfoRequestBuilder officeAddress(String officeAddress) {
            this.officeAddress = officeAddress;
            return this;
        }

        public SupportCompanyInfoRequestBuilder supportHours(String supportHours) {
            this.supportHours = supportHours;
            return this;
        }

        public SupportCompanyInfoRequestBuilder supportEmail(String supportEmail) {
            this.supportEmail = supportEmail;
            return this;
        }

        public SupportCompanyInfoRequestBuilder upiId(String upiId) {
            this.upiId = upiId;
            return this;
        }

        public SupportCompanyInfoRequestBuilder upiHolderName(String upiHolderName) {
            this.upiHolderName = upiHolderName;
            return this;
        }

        public SupportCompanyInfoRequestBuilder bankAccountNumber(String bankAccountNumber) {
            this.bankAccountNumber = bankAccountNumber;
            return this;
        }

        public SupportCompanyInfoRequestBuilder bankIfsc(String bankIfsc) {
            this.bankIfsc = bankIfsc;
            return this;
        }

        public SupportCompanyInfoRequestBuilder bankName(String bankName) {
            this.bankName = bankName;
            return this;
        }

        public SupportCompanyInfoRequest build() {
            SupportCompanyInfoRequest instance = new SupportCompanyInfoRequest();
            instance.companyName = this.companyName;
            instance.companyTagline = this.companyTagline;
            instance.companyDescription = this.companyDescription;
            instance.officeAddress = this.officeAddress;
            instance.supportHours = this.supportHours;
            instance.supportEmail = this.supportEmail;
            instance.upiId = this.upiId;
            instance.upiHolderName = this.upiHolderName;
            instance.bankAccountNumber = this.bankAccountNumber;
            instance.bankIfsc = this.bankIfsc;
            instance.bankName = this.bankName;
            return instance;
        }
    }

}
