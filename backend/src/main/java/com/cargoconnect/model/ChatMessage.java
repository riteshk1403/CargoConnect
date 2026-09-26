package com.cargoconnect.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages",
       indexes = {
           @Index(name = "idx_chat_shipment", columnList = "shipmentId")
       })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long shipmentId;

    private Long senderId;
    private String senderRole; // CUSTOMER, EMPLOYEE, ADMIN, CARGO_PARTNER
    private String senderName;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @Builder.Default
    private boolean isRead = false;

    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        if (timestamp == null) timestamp = LocalDateTime.now();
    }


    // --- Standard Constructors ---
    public ChatMessage() {}

    public ChatMessage(Long id, Long shipmentId, Long senderId, String senderRole, String senderName, String message, boolean isRead, LocalDateTime timestamp) {
        this.id = id;
        this.shipmentId = shipmentId;
        this.senderId = senderId;
        this.senderRole = senderRole;
        this.senderName = senderName;
        this.message = message;
        this.isRead = isRead;
        this.timestamp = timestamp;
    }


    // --- Getters & Setters ---
    public Long getId() { return this.id; }
    public void setId(Long id) { this.id = id; }
    public Long getShipmentId() { return this.shipmentId; }
    public void setShipmentId(Long shipmentId) { this.shipmentId = shipmentId; }
    public Long getSenderId() { return this.senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }
    public String getSenderRole() { return this.senderRole; }
    public void setSenderRole(String senderRole) { this.senderRole = senderRole; }
    public String getSenderName() { return this.senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }
    public String getMessage() { return this.message; }
    public void setMessage(String message) { this.message = message; }
    public boolean isRead() { return this.isRead; }
    public void setIsRead(boolean isRead) { this.isRead = isRead; }
    public LocalDateTime getTimestamp() { return this.timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }


    // --- Builder Pattern ---
    public static ChatMessageBuilder builder() {
        return new ChatMessageBuilder();
    }

    public static class ChatMessageBuilder {
        private Long id;
        private Long shipmentId;
        private Long senderId;
        private String senderRole;
        private String senderName;
        private String message;
        private boolean isRead;
        private LocalDateTime timestamp;

        public ChatMessageBuilder() {}

        public ChatMessageBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public ChatMessageBuilder shipmentId(Long shipmentId) {
            this.shipmentId = shipmentId;
            return this;
        }

        public ChatMessageBuilder senderId(Long senderId) {
            this.senderId = senderId;
            return this;
        }

        public ChatMessageBuilder senderRole(String senderRole) {
            this.senderRole = senderRole;
            return this;
        }

        public ChatMessageBuilder senderName(String senderName) {
            this.senderName = senderName;
            return this;
        }

        public ChatMessageBuilder message(String message) {
            this.message = message;
            return this;
        }

        public ChatMessageBuilder isRead(boolean isRead) {
            this.isRead = isRead;
            return this;
        }

        public ChatMessageBuilder timestamp(LocalDateTime timestamp) {
            this.timestamp = timestamp;
            return this;
        }

        public ChatMessage build() {
            ChatMessage instance = new ChatMessage();
            instance.id = this.id;
            instance.shipmentId = this.shipmentId;
            instance.senderId = this.senderId;
            instance.senderRole = this.senderRole;
            instance.senderName = this.senderName;
            instance.message = this.message;
            instance.isRead = this.isRead;
            instance.timestamp = this.timestamp;
            return instance;
        }
    }

}
