package com.cargoconnect.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "revoked_tokens",
       indexes = {
           @Index(name = "idx_revoked_token_id", columnList = "tokenId", unique = true)
       })
public class RevokedToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String tokenId; // JWT jti unique ID

    private Long userId;
    private String username;

    @Column(nullable = false)
    private LocalDateTime revokedAt;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @PrePersist
    protected void onCreate() {
        if (revokedAt == null) {
            revokedAt = LocalDateTime.now();
        }
    }


    // --- Standard Constructors ---
    public RevokedToken() {}

    public RevokedToken(Long id, String tokenId, Long userId, String username, LocalDateTime revokedAt, LocalDateTime expiresAt) {
        this.id = id;
        this.tokenId = tokenId;
        this.userId = userId;
        this.username = username;
        this.revokedAt = revokedAt;
        this.expiresAt = expiresAt;
    }


    // --- Getters & Setters ---
    public Long getId() { return this.id; }
    public void setId(Long id) { this.id = id; }
    public String getTokenId() { return this.tokenId; }
    public void setTokenId(String tokenId) { this.tokenId = tokenId; }
    public Long getUserId() { return this.userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUsername() { return this.username; }
    public void setUsername(String username) { this.username = username; }
    public LocalDateTime getRevokedAt() { return this.revokedAt; }
    public void setRevokedAt(LocalDateTime revokedAt) { this.revokedAt = revokedAt; }
    public LocalDateTime getExpiresAt() { return this.expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }


    // --- Builder Pattern ---
    public static RevokedTokenBuilder builder() {
        return new RevokedTokenBuilder();
    }

    public static class RevokedTokenBuilder {
        private Long id;
        private String tokenId;
        private Long userId;
        private String username;
        private LocalDateTime revokedAt;
        private LocalDateTime expiresAt;

        public RevokedTokenBuilder() {}

        public RevokedTokenBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public RevokedTokenBuilder tokenId(String tokenId) {
            this.tokenId = tokenId;
            return this;
        }

        public RevokedTokenBuilder userId(Long userId) {
            this.userId = userId;
            return this;
        }

        public RevokedTokenBuilder username(String username) {
            this.username = username;
            return this;
        }

        public RevokedTokenBuilder revokedAt(LocalDateTime revokedAt) {
            this.revokedAt = revokedAt;
            return this;
        }

        public RevokedTokenBuilder expiresAt(LocalDateTime expiresAt) {
            this.expiresAt = expiresAt;
            return this;
        }

        public RevokedToken build() {
            RevokedToken instance = new RevokedToken();
            instance.id = this.id;
            instance.tokenId = this.tokenId;
            instance.userId = this.userId;
            instance.username = this.username;
            instance.revokedAt = this.revokedAt;
            instance.expiresAt = this.expiresAt;
            return instance;
        }
    }

}
