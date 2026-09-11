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
public class SupportContactRequest {

    @NotBlank(message = "Support contact label is required (e.g. Primary Support, Secondary Support, Emergency Dispatch)")
    private String label;

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    @Builder.Default
    private Boolean isActive = true;

    @Builder.Default
    private Integer displayOrder = 0;
}
