package com.cargoconnect.repository;

import com.cargoconnect.model.SupportSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SupportSettingRepository extends JpaRepository<SupportSetting, Long> {
    Optional<SupportSetting> findTopByOrderByIdAsc();
}
