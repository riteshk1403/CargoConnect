package com.cargoconnect.dto;

import jakarta.validation.constraints.NotBlank;

public class ChatMessageDto {
    @NotBlank(message = "Message content is required")
    private String message;


    // --- Standard Constructors ---
    public ChatMessageDto() {}

    public ChatMessageDto(String message) {
        this.message = message;
    }


    // --- Getters & Setters ---
    public String getMessage() { return this.message; }
    public void setMessage(String message) { this.message = message; }


    // --- Builder Pattern ---
    public static ChatMessageDtoBuilder builder() {
        return new ChatMessageDtoBuilder();
    }

    public static class ChatMessageDtoBuilder {
        private String message;

        public ChatMessageDtoBuilder() {}

        public ChatMessageDtoBuilder message(String message) {
            this.message = message;
            return this;
        }

        public ChatMessageDto build() {
            ChatMessageDto instance = new ChatMessageDto();
            instance.message = this.message;
            return instance;
        }
    }

}
