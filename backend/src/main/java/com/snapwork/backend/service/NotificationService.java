package com.snapwork.backend.service;

import com.snapwork.backend.entity.Notification;
import com.snapwork.backend.entity.User;
import com.snapwork.backend.repository.NotificationRepository;
import com.snapwork.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    // 1. SEND NOTIFICATION
    public void sendNotification(Long userId, String message, String targetUrl) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found for notification"));

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notification.setTargetUrl(targetUrl);
        notification.setRead(false);

        notificationRepository.save(notification);
    }

    // 2. GET MY NOTIFICATIONS
    public List<Notification> getMyNotifications(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }

    // 3. GET UNREAD COUNT
    public long getUnreadCount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return notificationRepository.countByUserAndIsReadFalse(user);
    }

    // 4. MARK AS READ (Single)
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    // 5. MARK ALL AS READ
    public void markAllAsRead(Long userId) {
        // Fetch all unread notifications for this user
        List<Notification> unreadNotifications = notificationRepository.findAllByUser_UserIdAndIsReadFalse(userId);

        if (!unreadNotifications.isEmpty()) {
            for (Notification notification : unreadNotifications) {
                notification.setRead(true);
            }
            // Save all changes to database
            notificationRepository.saveAll(unreadNotifications);
        }
    }
}