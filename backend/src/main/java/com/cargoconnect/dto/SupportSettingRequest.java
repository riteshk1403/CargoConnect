package com.cargoconnect.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupportSettingRequest {

    @NotBlank(message = "Primary support phone number is required")
    private String primaryPhone;

    @NotBlank(message = "Secondary support phone number is required")
    private String secondaryPhone;

    @NotBlank(message = "Support email is required")
    @Email(message = "Please provide a valid support email address")
    private String supportEmail;

    @Builder.Default
    private Boolean primaryActive = true;

    @Builder.Default
    private Boolean secondaryActive = true;
}
