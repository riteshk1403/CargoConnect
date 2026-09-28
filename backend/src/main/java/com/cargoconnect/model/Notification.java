package com.cargoconnect.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId; // target user id (or null for all in role)
    private String role;   // e.g. "ROLE_SHIPPER", "ROLE_DRIVER", "ROLE_ADMIN"

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

        private String type = "INFO"; // INFO, SUCCESS, WARNING, ALERT

        private boolean readStatus = false;

    private String linkUrl;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }


    // --- Standard Constructors ---
    public Notification() {}

    public Notification(Long id, Long userId, String role, String title, String message, String type, boolean readStatus, String linkUrl, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.role = role;
        this.title = title;
        this.message = message;
        this.type = type;
        this.readStatus = readStatus;
        this.linkUrl = linkUrl;
        this.createdAt = createdAt;
    }


    // --- Getters & Setters ---
    public Long getId() { return this.id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return this.userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getRole() { return this.role; }
    public void setRole(String role) { this.role = role; }
    public String getTitle() { return this.title; }
    public void setTitle(String title) { this.title = title; }
    public String getMessage() { return this.message; }
    public void setMessage(String message) { this.message = message; }
    public String getType() { return this.type; }
    public void setType(String type) { this.type = type; }
    public boolean readStatus() { return this.readStatus; }
    public void setReadStatus(boolean readStatus) { this.readStatus = readStatus; }
    public String getLinkUrl() { return this.linkUrl; }
    public void setLinkUrl(String linkUrl) { this.linkUrl = linkUrl; }
    public LocalDateTime getCreatedAt() { return this.createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }


    // --- Builder Pattern ---
    public static NotificationBuilder builder() {
        return new NotificationBuilder();
    }

    public static class NotificationBuilder {
        private Long id;
        private Long userId;
        private String role;
        private String title;
        private String message;
        private String type;
        private boolean readStatus;
        private String linkUrl;
        private LocalDateTime createdAt;

        public NotificationBuilder() {}

        public NotificationBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public NotificationBuilder userId(Long userId) {
            this.userId = userId;
            return this;
        }

        public NotificationBuilder role(String role) {
            this.role = role;
            return this;
        }

        public NotificationBuilder title(String title) {
            this.title = title;
            return this;
        }

        public NotificationBuilder message(String message) {
            this.message = message;
            return this;
        }

        public NotificationBuilder type(String type) {
            this.type = type;
            return this;
        }

        public NotificationBuilder readStatus(boolean readStatus) {
            this.readStatus = readStatus;
            return this;
        }

        public NotificationBuilder linkUrl(String linkUrl) {
            this.linkUrl = linkUrl;
            return this;
        }

        public NotificationBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Notification build() {
            Notification instance = new Notification();
            instance.id = this.id;
            instance.userId = this.userId;
            instance.role = this.role;
            instance.title = this.title;
            instance.message = this.message;
            instance.type = this.type;
            instance.readStatus = this.readStatus;
            instance.linkUrl = this.linkUrl;
            instance.createdAt = this.createdAt;
            return instance;
        }
    }

}
