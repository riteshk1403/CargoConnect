package com.cargoconnect.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class QuoteResponseRequest {
    @NotBlank(message = "Response action is required: ACCEPTED, REJECTED, or NEGOTIATE")
    private String response; // ACCEPTED, REJECTED, NEGOTIATE

    private String notes;
}
