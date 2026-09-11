package com.cargoconnect.controller;

import com.cargoconnect.config.UserDetailsImpl;
import com.cargoconnect.model.Notification;
import com.cargoconnect.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<Notification>> getUserNotifications(Authentication auth) {
        Long userId = null;
        String role = null;
        if (auth != null && auth.getPrincipal() instanceof UserDetailsImpl) {
            UserDetailsImpl user = (UserDetailsImpl) auth.getPrincipal();
            userId = user.getId();
            role = user.getAuthorities().stream().findFirst().map(Object::toString).orElse(null);
        }
        return ResponseEntity.ok(notificationService.getNotificationsForUser(userId, role));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.markAsRead(id));
    }
}
