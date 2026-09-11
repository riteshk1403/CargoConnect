package com.cargoconnect.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ComplaintResolveRequest {
    @NotBlank(message = "Resolution action is required (e.g. RESOLVED, REJECTED, FULL_REFUND, PARTIAL_REFUND)")
    private String resolution;

    private String actionTaken;
    private Double customAmount;
}
