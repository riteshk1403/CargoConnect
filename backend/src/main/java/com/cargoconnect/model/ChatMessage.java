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
}
