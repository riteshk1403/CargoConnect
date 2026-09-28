package com.cargoconnect.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SignupRequest {
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 30, message = "Username must be between 3 and 30 characters")
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Valid email is required")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 50, message = "Password must be at least 6 characters")
    private String password;

    private String role; // ROLE_SHIPPER, ROLE_CARGO_PARTNER, ROLE_ADMIN, ROLE_EMPLOYEE

    // Profile fields
    private String name;
    private String phone;
    private String companyName;
    private String address;
    private String licenseNumber;


    // --- Standard Constructors ---
    public SignupRequest() {}

    public SignupRequest(String username, String email, String password, String role, String name, String phone, String companyName, String address, String licenseNumber) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.name = name;
        this.phone = phone;
        this.companyName = companyName;
        this.address = address;
        this.licenseNumber = licenseNumber;
    }


    // --- Getters & Setters ---
    public String getUsername() { return this.username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return this.email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return this.password; }
    public void setPassword(String password) { this.password = password; }
    public String getRole() { return this.role; }
    public void setRole(String role) { this.role = role; }
    public String getName() { return this.name; }
    public void setName(String name) { this.name = name; }
    public String getPhone() { return this.phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getCompanyName() { return this.companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getAddress() { return this.address; }
    public void setAddress(String address) { this.address = address; }
    public String getLicenseNumber() { return this.licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }


    // --- Builder Pattern ---
    public static SignupRequestBuilder builder() {
        return new SignupRequestBuilder();
    }

    public static class SignupRequestBuilder {
        private String username;
        private String email;
        private String password;
        private String role;
        private String name;
        private String phone;
        private String companyName;
        private String address;
        private String licenseNumber;

        public SignupRequestBuilder() {}

        public SignupRequestBuilder username(String username) {
            this.username = username;
            return this;
        }

        public SignupRequestBuilder email(String email) {
            this.email = email;
            return this;
        }

        public SignupRequestBuilder password(String password) {
            this.password = password;
            return this;
        }

        public SignupRequestBuilder role(String role) {
            this.role = role;
            return this;
        }

        public SignupRequestBuilder name(String name) {
            this.name = name;
            return this;
        }

        public SignupRequestBuilder phone(String phone) {
            this.phone = phone;
            return this;
        }

        public SignupRequestBuilder companyName(String companyName) {
            this.companyName = companyName;
            return this;
        }

        public SignupRequestBuilder address(String address) {
            this.address = address;
            return this;
        }

        public SignupRequestBuilder licenseNumber(String licenseNumber) {
            this.licenseNumber = licenseNumber;
            return this;
        }

        public SignupRequest build() {
            SignupRequest instance = new SignupRequest();
            instance.username = this.username;
            instance.email = this.email;
            instance.password = this.password;
            instance.role = this.role;
            instance.name = this.name;
            instance.phone = this.phone;
            instance.companyName = this.companyName;
            instance.address = this.address;
            instance.licenseNumber = this.licenseNumber;
            return instance;
        }
    }

}
