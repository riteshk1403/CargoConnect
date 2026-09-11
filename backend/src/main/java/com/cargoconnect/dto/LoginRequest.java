package com.cargoconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginRequest {
    private String username;
    private String email;
    private String password;

    public String getIdentifier() {
        if (email != null && !email.trim().isEmpty()) {
            return email.trim();
        }
        return username != null ? username.trim() : "";
    }
}
