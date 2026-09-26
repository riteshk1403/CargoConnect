package com.cargoconnect.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "customers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {
    public void setCorporate(boolean isCorporate) { this.isCorporate = isCorporate; }

    

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String phone;
    private String companyName;
    private String address;

    @Builder.Default
    private boolean isCorporate = false;

    @Builder.Default
    private Double creditLimit = 0.0;

    @Builder.Default
    private Double outstandingBalance = 0.0;


    // --- Standard Constructors ---
    public Customer() {}

    public Customer(Long id, String name, String email, String phone, String companyName, String address, boolean isCorporate, Double creditLimit, Double outstandingBalance) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.companyName = companyName;
        this.address = address;
        this.isCorporate = isCorporate;
        this.creditLimit = creditLimit;
        this.outstandingBalance = outstandingBalance;
    }


    // --- Getters & Setters ---
    public Long getId() { return this.id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return this.name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return this.email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return this.phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getCompanyName() { return this.companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getAddress() { return this.address; }
    public void setAddress(String address) { this.address = address; }
    public boolean isCorporate() { return this.isCorporate; }
    public void setIsCorporate(boolean isCorporate) { this.isCorporate = isCorporate; }
    public Double getCreditLimit() { return this.creditLimit; }
    public void setCreditLimit(Double creditLimit) { this.creditLimit = creditLimit; }
    public Double getOutstandingBalance() { return this.outstandingBalance; }
    public void setOutstandingBalance(Double outstandingBalance) { this.outstandingBalance = outstandingBalance; }


    // --- Builder Pattern ---
    public static CustomerBuilder builder() {
        return new CustomerBuilder();
    }

    public static class CustomerBuilder {
        private Long id;
        private String name;
        private String email;
        private String phone;
        private String companyName;
        private String address;
        private boolean isCorporate;
        private Double creditLimit;
        private Double outstandingBalance;

        public CustomerBuilder() {}

        public CustomerBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public CustomerBuilder name(String name) {
            this.name = name;
            return this;
        }

        public CustomerBuilder email(String email) {
            this.email = email;
            return this;
        }

        public CustomerBuilder phone(String phone) {
            this.phone = phone;
            return this;
        }

        public CustomerBuilder companyName(String companyName) {
            this.companyName = companyName;
            return this;
        }

        public CustomerBuilder address(String address) {
            this.address = address;
            return this;
        }

        public CustomerBuilder isCorporate(boolean isCorporate) {
            this.isCorporate = isCorporate;
            return this;
        }

        public CustomerBuilder creditLimit(Double creditLimit) {
            this.creditLimit = creditLimit;
            return this;
        }

        public CustomerBuilder outstandingBalance(Double outstandingBalance) {
            this.outstandingBalance = outstandingBalance;
            return this;
        }

        public Customer build() {
            Customer instance = new Customer();
            instance.id = this.id;
            instance.name = this.name;
            instance.email = this.email;
            instance.phone = this.phone;
            instance.companyName = this.companyName;
            instance.address = this.address;
            instance.isCorporate = this.isCorporate;
            instance.creditLimit = this.creditLimit;
            instance.outstandingBalance = this.outstandingBalance;
            return instance;
        }
    }

}
