package com.cargoconnect.service;

import com.cargoconnect.model.ChatMessage;
import com.cargoconnect.repository.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChatService {
    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private NotificationService notificationService;

    public List<ChatMessage> getShipmentMessages(Long shipmentId) {
        return chatMessageRepository.findByShipmentIdOrderByTimestampAsc(shipmentId);
    }

    public ChatMessage sendMessage(Long shipmentId, Long senderId, String senderRole, String senderName, String message) {
        ChatMessage msg = ChatMessage.builder()
                .shipmentId(shipmentId)
                .senderId(senderId)
                .senderRole(senderRole)
                .senderName(senderName)
                .message(message)
                .isRead(false)
                .timestamp(LocalDateTime.now())
                .build();
        ChatMessage saved = chatMessageRepository.save(msg);

        // Notify other participants
        String notifyRole = "CUSTOMER".equalsIgnoreCase(senderRole) ? "ROLE_ADMIN" : "ROLE_CUSTOMER";
        notificationService.sendNotification(null, notifyRole,
                "New Message on Shipment #" + shipmentId,
                senderName + ": " + (message.length() > 50 ? message.substring(0, 47) + "..." : message),
                "CHAT", "/shipper/shipments");

        return saved;
    }
}
