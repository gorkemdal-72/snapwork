
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NotificationService from "../services/NotificationService";

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (user) {
            loadNotifications();
        }
    }, []);

    const loadNotifications = () => {
        NotificationService.getMyNotifications(user.userId)
            .then(res => setNotifications(res.data))
            .catch(err => console.error(err));
    };

    const handleNotificationClick = (notif) => {
        // 1. Mark as Read in Backend
        if (!notif.read) {
            NotificationService.markAsRead(notif.notificationId)
                .then(() => {
                    // Update UI locally
                    setNotifications(prev => prev.map(n =>
                        n.notificationId === notif.notificationId ? { ...n, read: true } : n
                    ));
                });
        }

        // 2. Navigate to Target (e.g., /my-jobs)
        if (notif.targetUrl) {
            navigate(notif.targetUrl);
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "20px auto", padding: "20px" }}>
            <h2 style={{ textAlign: "center", color: "#2c3e50", marginBottom: 20 }}>🔔 Notifications</h2>

            {notifications.length === 0 ? (
                <p style={{ textAlign: "center", color: "#777" }}>No notifications yet.</p>
            ) : (
                <div style={{ display: "grid", gap: "10px" }}>
                    {notifications.map((notif) => (
                        <div
                            key={notif.notificationId}
                            onClick={() => handleNotificationClick(notif)}
                            style={{
                                padding: "15px",
                                borderRadius: "8px",
                                borderLeft: notif.read ? "5px solid #ccc" : "5px solid #007bff",
                                backgroundColor: notif.read ? "#f9f9f9" : "#e3f2fd",
                                cursor: "pointer",
                                transition: "0.2s",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                            }}
                        >
                            <p style={{ margin: 0, fontWeight: notif.read ? "normal" : "bold", color: "#333" }}>
                                {notif.message}
                            </p>
                            <small style={{ color: "#888" }}>
                                {new Date(notif.createdAt).toLocaleString()}
                            </small>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationsPage;