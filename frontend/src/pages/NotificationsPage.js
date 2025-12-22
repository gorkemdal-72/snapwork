import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NotificationService from "../services/NotificationService";
import { useNotification } from "../context/NotificationContext";

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    const { refreshNotifications } = useNotification();

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = () => {
        if (user) {
            NotificationService.getMyNotifications(user.userId)
                .then(res => setNotifications(res.data))
                .catch(err => console.error(err));
        }
    };

    // Mark as read (Update UI + Backend + Badge)
    const handleMarkAsRead = (notificationId) => {
        NotificationService.markAsRead(notificationId)
            .then(() => {
                const updatedList = notifications.map(n =>
                    n.notificationId === notificationId ? { ...n, read: true } : n
                );
                setNotifications(updatedList);
                refreshNotifications();
            })
            .catch(err => console.error(err));
    };

    const handleMarkAllAsRead = () => {
        if (user) {
            NotificationService.markAllAsRead(user.userId)
                .then(() => {
                    const updatedList = notifications.map(n => ({ ...n, read: true }));
                    setNotifications(updatedList);
                    refreshNotifications();
                })
                .catch(err => console.error(err));
        }
    };

    // HANDLE CLICK: Mark as read & Navigate
    const handleNotificationClick = (notif) => {
        // 1. Mark as read if unread
        if (!notif.read) {
            handleMarkAsRead(notif.notificationId);
        }

        // 2. Navigate if URL exists
        if (notif.targetUrl) {
            navigate(notif.targetUrl);
        }
    };

    return (
        <div style={{ maxWidth: "800px", margin: "20px auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2>Notifications</h2>
                <button
                    onClick={handleMarkAllAsRead}
                    style={{ padding: "8px 12px", backgroundColor: "#333", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                >
                    Mark All as Read
                </button>
            </div>

            {notifications.length === 0 ? (
                <p style={{ textAlign: "center", color: "#777" }}>No notifications yet.</p>
            ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {notifications.map((notif) => (
                        <li
                            key={notif.notificationId}
                            onClick={() => handleNotificationClick(notif)}
                            style={{
                                padding: "15px",
                                marginBottom: "10px", // Add spacing between items
                                border: "1px solid #eee",
                                borderRadius: "8px", // Rounded corners
                                backgroundColor: notif.read ? "#fff" : "#e3f2fd", // Distinct color for unread
                                cursor: "pointer",
                                transition: "all 0.2s",
                                display: "flex",
                                flexDirection: "column"
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = notif.read ? "#f9f9f9" : "#d1e9fc"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = notif.read ? "#fff" : "#e3f2fd"}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <p style={{ margin: "0 0 5px 0", fontWeight: notif.read ? "normal" : "bold", color: "#333", fontSize: "1rem" }}>
                                    {notif.message}
                                </p>
                                {!notif.read && (
                                    <span style={{ fontSize: "0.7rem", backgroundColor: "#007bff", color: "white", padding: "2px 6px", borderRadius: "4px" }}>
                                        NEW
                                    </span>
                                )}
                            </div>

                            <small style={{ color: "#888", marginTop: "5px" }}>
                                {new Date(notif.createdAt).toLocaleString()}
                            </small>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default NotificationsPage;