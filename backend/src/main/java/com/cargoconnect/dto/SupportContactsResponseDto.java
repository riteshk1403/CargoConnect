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
}
