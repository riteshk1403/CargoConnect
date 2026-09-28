package com.cargoconnect.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

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


    // --- Standard Constructors ---
    public AuthResponse() {}

    public AuthResponse(String token, Long id, String username, String name, String email, String role, boolean emailVerified, Long customerId, Long cargoPartnerId, Long driverId, String message) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.name = name;
        this.email = email;
        this.role = role;
        this.emailVerified = emailVerified;
        this.customerId = customerId;
        this.cargoPartnerId = cargoPartnerId;
        this.driverId = driverId;
        this.message = message;
    }


    // --- Getters & Setters ---
    public String getToken() { return this.token; }
    public void setToken(String token) { this.token = token; }
    public Long getId() { return this.id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return this.username; }
    public void setUsername(String username) { this.username = username; }
    public String getName() { return this.name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return this.email; }
    public void setEmail(String email) { this.email = email; }
    public String getRole() { return this.role; }
    public boolean isEmailVerified() { return this.emailVerified; }
    public boolean getEmailVerified() { return this.emailVerified; }
    public void setEmailVerified(boolean emailVerified) { this.emailVerified = emailVerified; }
    public Long getCustomerId() { return this.customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public Long getCargoPartnerId() { return this.cargoPartnerId; }
    public void setCargoPartnerId(Long cargoPartnerId) { this.cargoPartnerId = cargoPartnerId; }
    public Long getDriverId() { return this.driverId; }
    public void setDriverId(Long driverId) { this.driverId = driverId; }
    public String getMessage() { return this.message; }
    public void setMessage(String message) { this.message = message; }


    // --- Builder Pattern ---
    public static AuthResponseBuilder builder() {
        return new AuthResponseBuilder();
    }

    public static class AuthResponseBuilder {
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

        public AuthResponseBuilder() {}

        public AuthResponseBuilder token(String token) {
            this.token = token;
            return this;
        }

        public AuthResponseBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public AuthResponseBuilder username(String username) {
            this.username = username;
            return this;
        }

        public AuthResponseBuilder name(String name) {
            this.name = name;
            return this;
        }

        public AuthResponseBuilder email(String email) {
            this.email = email;
            return this;
        }

        public AuthResponseBuilder role(String role) {
            this.role = role;
            return this;
        }

        public AuthResponseBuilder emailVerified(boolean emailVerified) {
            this.emailVerified = emailVerified;
            return this;
        }

        public AuthResponseBuilder customerId(Long customerId) {
            this.customerId = customerId;
            return this;
        }

        public AuthResponseBuilder cargoPartnerId(Long cargoPartnerId) {
            this.cargoPartnerId = cargoPartnerId;
            return this;
        }

        public AuthResponseBuilder driverId(Long driverId) {
            this.driverId = driverId;
            return this;
        }

        public AuthResponseBuilder message(String message) {
            this.message = message;
            return this;
        }

        public AuthResponse build() {
            AuthResponse instance = new AuthResponse();
            instance.token = this.token;
            instance.id = this.id;
            instance.username = this.username;
            instance.name = this.name;
            instance.email = this.email;
            instance.role = this.role;
            instance.emailVerified = this.emailVerified;
            instance.customerId = this.customerId;
            instance.cargoPartnerId = this.cargoPartnerId;
            instance.driverId = this.driverId;
            instance.message = this.message;
            return instance;
        }
    }

}
