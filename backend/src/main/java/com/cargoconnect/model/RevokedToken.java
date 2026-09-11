package com.cargoconnect.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "revoked_tokens",
       indexes = {
           @Index(name = "idx_revoked_token_id", columnList = "tokenId", unique = true)
       })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
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
}
