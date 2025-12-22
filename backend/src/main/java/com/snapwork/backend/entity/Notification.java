package com.snapwork.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_id")
    private Long notificationId;

    // Who receives this notification
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // The content of the notification
    @Column(nullable = false)
    private String message;

    // Where should the user go when they click
    @Column(name = "target_url")
    private String targetUrl;

    @Column(name = "is_read")
    private boolean isRead = false;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}