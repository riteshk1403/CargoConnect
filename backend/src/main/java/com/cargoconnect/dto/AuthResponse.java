package com.cargoconnect.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuthResponse {
    private String token;
    private Long id;
    private String username;
    private String name;
    private String email;
    private String role;
    private boolean emailVerified;
    private Long customerId;
    private Long cargoPartnerId;
    private Long driverId;
    private String message;
}
