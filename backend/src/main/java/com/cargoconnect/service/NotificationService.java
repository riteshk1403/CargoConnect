package com.cargoconnect.service;

import com.cargoconnect.model.Notification;
import com.cargoconnect.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    public void createNotification(Long userId, String role, String title, String message, String type, String linkUrl) {
        Notification notification = Notification.builder()
                .userId(userId)
                .role(role)
                .title(title)
                .message(message)
                .type(type != null ? type : "INFO")
                .readStatus(false)
                .linkUrl(linkUrl)
                .createdAt(LocalDateTime.now())
                .build();
        notificationRepository.save(notification);
    }

    public void sendNotification(Long userId, String role, String title, String message, String type, String linkUrl) {
        createNotification(userId, role, title, message, type, linkUrl);
    }

    public List<Notification> getNotificationsForUser(Long userId, String role) {
        if (userId != null && role != null) {
            return notificationRepository.findByUserIdOrRoleOrderByCreatedAtDesc(userId, role);
        } else if (userId != null) {
            return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        } else if (role != null) {
            return notificationRepository.findByRoleOrderByCreatedAtDesc(role);
        }
        return notificationRepository.findAll();
    }

    public Notification markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id).orElse(null);
        if (notification != null) {
            notification.setReadStatus(true);
            return notificationRepository.save(notification);
        }
        return null;
    }
}
