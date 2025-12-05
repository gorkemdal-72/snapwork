package com.snapwork.backend.repository;

import com.snapwork.backend.entity.Notification;
import com.snapwork.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Get all notifications for a user, sorted by newest first
    List<Notification> findByUserOrderByCreatedAtDesc(User user);

    // Count unread notifications (For the red badge icon)
    long countByUserAndIsReadFalse(User user);
}