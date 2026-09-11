package com.cargoconnect.service;

import com.cargoconnect.model.CommissionSetting;
import com.cargoconnect.repository.CommissionSettingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class CommissionService {
    @Autowired
    private CommissionSettingRepository commissionSettingRepository;

    @Autowired
    private AuditLogService auditLogService;

    public record CommissionResult(Double commissionRate, Double commissionAmount, Double partnerAmount) {}

    public CommissionSetting getCommissionSetting() {
        return commissionSettingRepository.findTopByOrderByIdAsc()
                .orElseGet(() -> {
                    CommissionSetting def = CommissionSetting.builder()
                            .commissionType(CommissionSetting.CommissionType.PERCENTAGE)
                            .commissionRate(10.0)
                            .updatedBy("system")
                            .updatedAt(LocalDateTime.now())
                            .build();
                    return commissionSettingRepository.save(def);
                });
    }

    public CommissionSetting updateCommissionRate(Double newRate, String adminUsername) {
        if (newRate == null || newRate < 0 || newRate > 100) {
            throw new IllegalArgumentException("Commission rate must be between 0% and 100%");
        }
        CommissionSetting setting = getCommissionSetting();
        Double oldRate = setting.getCommissionRate();
        setting.setCommissionRate(newRate);
        setting.setUpdatedBy(adminUsername != null ? adminUsername : "admin");
        setting.setUpdatedAt(LocalDateTime.now());
        CommissionSetting saved = commissionSettingRepository.save(setting);

        auditLogService.log(adminUsername != null ? adminUsername : "admin", "ROLE_ADMIN",
                "COMMISSION_UPDATED", "COMMISSION", String.valueOf(saved.getId()),
                "Commission rate updated from " + oldRate + "% to " + newRate + "%");

        return saved;
    }

    public CommissionResult calculateCommission(Double fare) {
        if (fare == null || fare <= 0) {
            return new CommissionResult(10.0, 0.0, 0.0);
        }
        CommissionSetting setting = getCommissionSetting();
        double rate = setting.getCommissionRate();
        double commissionAmount = Math.round((fare * (rate / 100.0)) * 100.0) / 100.0;
        double partnerAmount = Math.round((fare - commissionAmount) * 100.0) / 100.0;
        return new CommissionResult(rate, commissionAmount, partnerAmount);
    }
}
