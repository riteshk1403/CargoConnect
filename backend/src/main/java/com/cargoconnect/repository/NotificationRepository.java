package com.cargoconnect.repository;

import com.cargoconnect.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Notification> findByRoleOrderByCreatedAtDesc(String role);
    List<Notification> findByUserIdOrRoleOrderByCreatedAtDesc(Long userId, String role);
}
