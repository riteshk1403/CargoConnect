package com.cargoconnect.repository;

import com.cargoconnect.model.RevokedToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface RevokedTokenRepository extends JpaRepository<RevokedToken, Long> {
    boolean existsByTokenId(String tokenId);
    void deleteByExpiresAtBefore(LocalDateTime now);
}
