package com.snapwork.backend.controller;

import com.snapwork.backend.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    // get all notification
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getMyNotifications(@PathVariable Long userId) {
        return ResponseEntity.ok(notificationService.getMyNotifications(userId));
    }

    // get unread notification count
    @GetMapping("/user/{userId}/count")
    public ResponseEntity<?> getUnreadCount(@PathVariable Long userId) {
        return ResponseEntity.ok(notificationService.getUnreadCount(userId));
    }

    // mark one notificaiton as read
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long notificationId) {
        try {
            notificationService.markAsRead(notificationId);
            return ResponseEntity.ok("Notification marked as read");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // mark all notificaiton as read
    @PutMapping("/read-all/{userId}")
    public ResponseEntity<String> markAllAsRead(@PathVariable Long userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok("All notifications marked as read.");
    }
}