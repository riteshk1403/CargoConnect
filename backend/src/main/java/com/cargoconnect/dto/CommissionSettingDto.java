package com.cargoconnect.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class CommissionSettingDto {
    private String commissionType = "PERCENTAGE";

    @NotNull(message = "Commission rate is required")
    @Positive(message = "Commission rate must be positive")
    private Double commissionRate; // e.g. 10.0
}
