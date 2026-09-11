package com.cargoconnect.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ConfirmPartnerRequest {
    @NotNull(message = "Cargo Partner ID is required")
    private Long partnerId;
}
