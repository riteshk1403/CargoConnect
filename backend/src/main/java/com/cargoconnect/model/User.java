package com.cargoconnect.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users",
       indexes = {
           @Index(name = "idx_user_email", columnList = "email"),
           @Index(name = "idx_user_username", columnList = "username")
       })
public class User {
    public boolean isEmailVerified() { return this.emailVerified; }
    public boolean isActive() { return this.active; }

    

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

        private boolean emailVerified = false;

    // 6-Digit Email Verification OTP fields
    private String verificationOtp;
    private LocalDateTime verificationOtpExpiry;
        private int otpAttemptCount = 0;
    private LocalDateTime lastOtpSentAt;

    // 6-Digit Password Reset OTP fields
    private String passwordResetOtp;
    private LocalDateTime passwordResetOtpExpiry;
        private int passwordResetAttemptCount = 0;
    private LocalDateTime lastResetOtpSentAt;

    // Legacy token field for backward compatibility
    private String verificationToken;
    private LocalDateTime verificationTokenExpiry;

    private Long customerId;
    private Long cargoPartnerId;
    private Long driverId;

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


    // --- Standard Constructors ---
    public User() {}

    public User(Long id, String username, String email, String password, Role role, boolean emailVerified, String verificationOtp, LocalDateTime verificationOtpExpiry, int otpAttemptCount, LocalDateTime lastOtpSentAt, String passwordResetOtp, LocalDateTime passwordResetOtpExpiry, int passwordResetAttemptCount, LocalDateTime lastResetOtpSentAt, String verificationToken, LocalDateTime verificationTokenExpiry, Long customerId, Long cargoPartnerId, Long driverId, boolean active, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.emailVerified = emailVerified;
        this.verificationOtp = verificationOtp;
        this.verificationOtpExpiry = verificationOtpExpiry;
        this.otpAttemptCount = otpAttemptCount;
        this.lastOtpSentAt = lastOtpSentAt;
        this.passwordResetOtp = passwordResetOtp;
        this.passwordResetOtpExpiry = passwordResetOtpExpiry;
        this.passwordResetAttemptCount = passwordResetAttemptCount;
        this.lastResetOtpSentAt = lastResetOtpSentAt;
        this.verificationToken = verificationToken;
        this.verificationTokenExpiry = verificationTokenExpiry;
        this.customerId = customerId;
        this.cargoPartnerId = cargoPartnerId;
        this.driverId = driverId;
        this.active = active;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }


    // --- Getters & Setters ---
    public Long getId() { return this.id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return this.username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return this.email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return this.password; }
    public void setPassword(String password) { this.password = password; }
    public Role getRole() { return this.role; }
    public void setRole(Role role) { this.role = role; }
    public boolean emailVerified() { return this.emailVerified; }
    public void setEmailVerified(boolean emailVerified) { this.emailVerified = emailVerified; }
    public String getVerificationOtp() { return this.verificationOtp; }
    public void setVerificationOtp(String verificationOtp) { this.verificationOtp = verificationOtp; }
    public LocalDateTime getVerificationOtpExpiry() { return this.verificationOtpExpiry; }
    public void setVerificationOtpExpiry(LocalDateTime verificationOtpExpiry) { this.verificationOtpExpiry = verificationOtpExpiry; }
    public int getOtpAttemptCount() { return this.otpAttemptCount; }
    public void setOtpAttemptCount(int otpAttemptCount) { this.otpAttemptCount = otpAttemptCount; }
    public LocalDateTime getLastOtpSentAt() { return this.lastOtpSentAt; }
    public void setLastOtpSentAt(LocalDateTime lastOtpSentAt) { this.lastOtpSentAt = lastOtpSentAt; }
    public String getPasswordResetOtp() { return this.passwordResetOtp; }
    public void setPasswordResetOtp(String passwordResetOtp) { this.passwordResetOtp = passwordResetOtp; }
    public LocalDateTime getPasswordResetOtpExpiry() { return this.passwordResetOtpExpiry; }
    public void setPasswordResetOtpExpiry(LocalDateTime passwordResetOtpExpiry) { this.passwordResetOtpExpiry = passwordResetOtpExpiry; }
    public int getPasswordResetAttemptCount() { return this.passwordResetAttemptCount; }
    public void setPasswordResetAttemptCount(int passwordResetAttemptCount) { this.passwordResetAttemptCount = passwordResetAttemptCount; }
    public LocalDateTime getLastResetOtpSentAt() { return this.lastResetOtpSentAt; }
    public void setLastResetOtpSentAt(LocalDateTime lastResetOtpSentAt) { this.lastResetOtpSentAt = lastResetOtpSentAt; }
    public String getVerificationToken() { return this.verificationToken; }
    public void setVerificationToken(String verificationToken) { this.verificationToken = verificationToken; }
    public LocalDateTime getVerificationTokenExpiry() { return this.verificationTokenExpiry; }
    public void setVerificationTokenExpiry(LocalDateTime verificationTokenExpiry) { this.verificationTokenExpiry = verificationTokenExpiry; }
    public Long getCustomerId() { return this.customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public Long getCargoPartnerId() { return this.cargoPartnerId; }
    public void setCargoPartnerId(Long cargoPartnerId) { this.cargoPartnerId = cargoPartnerId; }
    public Long getDriverId() { return this.driverId; }
    public void setDriverId(Long driverId) { this.driverId = driverId; }
    public boolean active() { return this.active; }
    public void setActive(boolean active) { this.active = active; }
    public LocalDateTime getCreatedAt() { return this.createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return this.updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }


    // --- Builder Pattern ---
    public static UserBuilder builder() {
        return new UserBuilder();
    }

    public static class UserBuilder {
        private Long id;
        private String username;
        private String email;
        private String password;
        private Role role;
        private boolean emailVerified;
        private String verificationOtp;
        private LocalDateTime verificationOtpExpiry;
        private int otpAttemptCount;
        private LocalDateTime lastOtpSentAt;
        private String passwordResetOtp;
        private LocalDateTime passwordResetOtpExpiry;
        private int passwordResetAttemptCount;
        private LocalDateTime lastResetOtpSentAt;
        private String verificationToken;
        private LocalDateTime verificationTokenExpiry;
        private Long customerId;
        private Long cargoPartnerId;
        private Long driverId;
        private boolean active;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public UserBuilder() {}

        public UserBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public UserBuilder username(String username) {
            this.username = username;
            return this;
        }

        public UserBuilder email(String email) {
            this.email = email;
            return this;
        }

        public UserBuilder password(String password) {
            this.password = password;
            return this;
        }

        public UserBuilder role(Role role) {
            this.role = role;
            return this;
        }

        public UserBuilder emailVerified(boolean emailVerified) {
            this.emailVerified = emailVerified;
            return this;
        }

        public UserBuilder verificationOtp(String verificationOtp) {
            this.verificationOtp = verificationOtp;
            return this;
        }

        public UserBuilder verificationOtpExpiry(LocalDateTime verificationOtpExpiry) {
            this.verificationOtpExpiry = verificationOtpExpiry;
            return this;
        }

        public UserBuilder otpAttemptCount(int otpAttemptCount) {
            this.otpAttemptCount = otpAttemptCount;
            return this;
        }

        public UserBuilder lastOtpSentAt(LocalDateTime lastOtpSentAt) {
            this.lastOtpSentAt = lastOtpSentAt;
            return this;
        }

        public UserBuilder passwordResetOtp(String passwordResetOtp) {
            this.passwordResetOtp = passwordResetOtp;
            return this;
        }

        public UserBuilder passwordResetOtpExpiry(LocalDateTime passwordResetOtpExpiry) {
            this.passwordResetOtpExpiry = passwordResetOtpExpiry;
            return this;
        }

        public UserBuilder passwordResetAttemptCount(int passwordResetAttemptCount) {
            this.passwordResetAttemptCount = passwordResetAttemptCount;
            return this;
        }

        public UserBuilder lastResetOtpSentAt(LocalDateTime lastResetOtpSentAt) {
            this.lastResetOtpSentAt = lastResetOtpSentAt;
            return this;
        }

        public UserBuilder verificationToken(String verificationToken) {
            this.verificationToken = verificationToken;
            return this;
        }

        public UserBuilder verificationTokenExpiry(LocalDateTime verificationTokenExpiry) {
            this.verificationTokenExpiry = verificationTokenExpiry;
            return this;
        }

        public UserBuilder customerId(Long customerId) {
            this.customerId = customerId;
            return this;
        }

        public UserBuilder cargoPartnerId(Long cargoPartnerId) {
            this.cargoPartnerId = cargoPartnerId;
            return this;
        }

        public UserBuilder driverId(Long driverId) {
            this.driverId = driverId;
            return this;
        }

        public UserBuilder active(boolean active) {
            this.active = active;
            return this;
        }

        public UserBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public UserBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public User build() {
            User instance = new User();
            instance.id = this.id;
            instance.username = this.username;
            instance.email = this.email;
            instance.password = this.password;
            instance.role = this.role;
            instance.emailVerified = this.emailVerified;
            instance.verificationOtp = this.verificationOtp;
            instance.verificationOtpExpiry = this.verificationOtpExpiry;
            instance.otpAttemptCount = this.otpAttemptCount;
            instance.lastOtpSentAt = this.lastOtpSentAt;
            instance.passwordResetOtp = this.passwordResetOtp;
            instance.passwordResetOtpExpiry = this.passwordResetOtpExpiry;
            instance.passwordResetAttemptCount = this.passwordResetAttemptCount;
            instance.lastResetOtpSentAt = this.lastResetOtpSentAt;
            instance.verificationToken = this.verificationToken;
            instance.verificationTokenExpiry = this.verificationTokenExpiry;
            instance.customerId = this.customerId;
            instance.cargoPartnerId = this.cargoPartnerId;
            instance.driverId = this.driverId;
            instance.active = this.active;
            instance.createdAt = this.createdAt;
            instance.updatedAt = this.updatedAt;
            return instance;
        }
    }

}
