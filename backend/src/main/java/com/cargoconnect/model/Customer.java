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
}
