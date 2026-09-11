package com.cargoconnect.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChatMessageDto {
    @NotBlank(message = "Message content is required")
    private String message;
}
