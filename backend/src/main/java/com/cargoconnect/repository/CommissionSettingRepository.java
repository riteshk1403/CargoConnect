package com.cargoconnect.repository;

import com.cargoconnect.model.CommissionSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CommissionSettingRepository extends JpaRepository<CommissionSetting, Long> {
    Optional<CommissionSetting> findTopByOrderByIdAsc();
}
