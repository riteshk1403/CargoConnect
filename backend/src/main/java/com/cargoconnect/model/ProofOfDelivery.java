package com.cargoconnect.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "proof_of_delivery")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProofOfDelivery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long shipmentId;

    private String enteredOtp;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String signatureData;

    private String photoUrl;
    private String notes;

    private LocalDateTime verifiedAt;

    @PrePersist
    protected void onCreate() {
        if (verifiedAt == null) verifiedAt = LocalDateTime.now();
    }
}
