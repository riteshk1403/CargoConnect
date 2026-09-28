package com.cargoconnect.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String userRole;

    @Column(nullable = false)
    private String action; // e.g. "VEHICLE_ASSIGNED", "DRIVER_VERIFIED", "BREAKDOWN_RECORDED"

    private String entityType; // e.g. "SHIPMENT", "VEHICLE", "DRIVER", "DOCUMENT"
    private String entityId;

    @Column(columnDefinition = "TEXT")
    private String details;

    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        if (timestamp == null) timestamp = LocalDateTime.now();
    }


    // --- Standard Constructors ---
    public AuditLog() {}

    public AuditLog(Long id, String username, String userRole, String action, String entityType, String entityId, String details, LocalDateTime timestamp) {
        this.id = id;
        this.username = username;
        this.userRole = userRole;
        this.action = action;
        this.entityType = entityType;
        this.entityId = entityId;
        this.details = details;
        this.timestamp = timestamp;
    }


    // --- Getters & Setters ---
    public Long getId() { return this.id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return this.username; }
    public void setUsername(String username) { this.username = username; }
    public String getUserRole() { return this.userRole; }
    public void setUserRole(String userRole) { this.userRole = userRole; }
    public String getAction() { return this.action; }
    public void setAction(String action) { this.action = action; }
    public String getEntityType() { return this.entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }
    public String getEntityId() { return this.entityId; }
    public void setEntityId(String entityId) { this.entityId = entityId; }
    public String getDetails() { return this.details; }
    public void setDetails(String details) { this.details = details; }
    public LocalDateTime getTimestamp() { return this.timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }


    // --- Builder Pattern ---
    public static AuditLogBuilder builder() {
        return new AuditLogBuilder();
    }

    public static class AuditLogBuilder {
        private Long id;
        private String username;
        private String userRole;
        private String action;
        private String entityType;
        private String entityId;
        private String details;
        private LocalDateTime timestamp;

        public AuditLogBuilder() {}

        public AuditLogBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public AuditLogBuilder username(String username) {
            this.username = username;
            return this;
        }

        public AuditLogBuilder userRole(String userRole) {
            this.userRole = userRole;
            return this;
        }

        public AuditLogBuilder action(String action) {
            this.action = action;
            return this;
        }

        public AuditLogBuilder entityType(String entityType) {
            this.entityType = entityType;
            return this;
        }

        public AuditLogBuilder entityId(String entityId) {
            this.entityId = entityId;
            return this;
        }

        public AuditLogBuilder details(String details) {
            this.details = details;
            return this;
        }

        public AuditLogBuilder timestamp(LocalDateTime timestamp) {
            this.timestamp = timestamp;
            return this;
        }

        public AuditLog build() {
            AuditLog instance = new AuditLog();
            instance.id = this.id;
            instance.username = this.username;
            instance.userRole = this.userRole;
            instance.action = this.action;
            instance.entityType = this.entityType;
            instance.entityId = this.entityId;
            instance.details = this.details;
            instance.timestamp = this.timestamp;
            return instance;
        }
    }

}
