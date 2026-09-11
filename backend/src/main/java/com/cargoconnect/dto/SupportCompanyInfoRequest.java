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

}
