package com.cargoconnect.service;

import com.cargoconnect.model.AuditLog;
import com.cargoconnect.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditLogService {
    @Autowired
    private AuditLogRepository auditLogRepository;

    public void log(String username, String userRole, String action, String entityType, String entityId, String details) {
        AuditLog log = AuditLog.builder()
                .username(username != null ? username : "SYSTEM")
                .userRole(userRole != null ? userRole : "SYSTEM")
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .details(details)
                .timestamp(LocalDateTime.now())
                .build();
        auditLogRepository.save(log);
    }

    public List<AuditLog> getAllLogs() {
        return auditLogRepository.findAllByOrderByTimestampDesc();
    }
}
