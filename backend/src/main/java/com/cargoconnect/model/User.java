package com.cargoconnect.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users",
       indexes = {
           @Index(name = "idx_user_email", columnList = "email"),
           @Index(name = "idx_user_username", columnList = "username")
       })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Builder.Default
    private boolean emailVerified = false;

    // 6-Digit Email Verification OTP fields
    private String verificationOtp;
    private LocalDateTime verificationOtpExpiry;
    @Builder.Default
    private int otpAttemptCount = 0;
    private LocalDateTime lastOtpSentAt;

    // 6-Digit Password Reset OTP fields
    private String passwordResetOtp;
    private LocalDateTime passwordResetOtpExpiry;
    @Builder.Default
    private int passwordResetAttemptCount = 0;
    private LocalDateTime lastResetOtpSentAt;

    // Legacy token field for backward compatibility
    private String verificationToken;
    private LocalDateTime verificationTokenExpiry;

    private Long customerId;
    private Long cargoPartnerId;
    private Long driverId;

    @Builder.Default
    private boolean active = true;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (updatedAt == null) {
            updatedAt = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
