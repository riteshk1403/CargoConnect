package com.cargoconnect.dto;

import com.cargoconnect.model.DocumentEntity.Status;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DocumentVerifyRequest {
    @NotNull(message = "Verification status is required (VERIFIED or REJECTED)")
    private Status status;

    private String rejectionReason;
}
