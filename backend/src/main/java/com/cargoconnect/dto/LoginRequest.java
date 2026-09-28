package com.cargoconnect.dto;


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


    // --- Standard Constructors ---
    public LoginRequest() {}

    public LoginRequest(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }


    // --- Getters & Setters ---
    public String getUsername() { return this.username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return this.email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return this.password; }
    public void setPassword(String password) { this.password = password; }


    // --- Builder Pattern ---
    public static LoginRequestBuilder builder() {
        return new LoginRequestBuilder();
    }

    public static class LoginRequestBuilder {
        private String username;
        private String email;
        private String password;

        public LoginRequestBuilder() {}

        public LoginRequestBuilder username(String username) {
            this.username = username;
            return this;
        }

        public LoginRequestBuilder email(String email) {
            this.email = email;
            return this;
        }

        public LoginRequestBuilder password(String password) {
            this.password = password;
            return this;
        }

        public LoginRequest build() {
            LoginRequest instance = new LoginRequest();
            instance.username = this.username;
            instance.email = this.email;
            instance.password = this.password;
            return instance;
        }
    }

}
