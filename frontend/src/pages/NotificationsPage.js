import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NotificationService from "../services/NotificationService";
import Swal from "sweetalert2";

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();

    // Kullanıcı bilgisini güvenli al
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;

    const swalOptions = {
        showClass: { popup: '', backdrop: '' },
        hideClass: { popup: '' }
    };

    useEffect(() => {
        if (user && user.userId) {
            // Fonksiyonu useEffect içine taşıyarak uyarıyı çözdük
            const fetchNotifications = () => {
                NotificationService.getMyNotifications(user.userId)
                    .then(res => setNotifications(res.data))
                    .catch(err => console.error("Load Error:", err));
            };

            fetchNotifications();
        }
    }, [user.userId]); // Artık dependency array doğru

    const handleNotificationClick = (notif) => {
        if (!notif.read) {
            NotificationService.markAsRead(notif.notificationId)
                .then(() => {
                    setNotifications(prev => prev.map(n =>
                        n.notificationId === notif.notificationId ? { ...n, read: true } : n
                    ));
                })
                .catch(err => console.error(err));
        }
        if (notif.targetUrl) {
            navigate(notif.targetUrl);
        }
    };

    const handleMarkAllRead = () => {
        if (!user || !user.userId) {
            alert("User ID not found!");
            return;
        }

        console.log("Sending request for User ID:", user.userId); // Konsola ID'yi yazdır

        Swal.fire({
            title: 'Mark all as read?',
            text: "All unread notifications will be marked as read.",
            iconHtml: '❓',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, mark all',
            ...swalOptions
        }).then((result) => {
            if (result.isConfirmed) {
                NotificationService.markAllAsRead(user.userId)
                    .then(() => {
                        // Başarılı olursa listeyi güncelle
                        setNotifications(prev => prev.map(n => ({ ...n, read: true })));

                        Swal.fire({
                            title: 'Success!',
                            text: 'All notifications marked as read.',
                            iconHtml: '✅',
                            timer: 1500,
                            showConfirmButton: false,
                            ...swalOptions
                        });
                    })
                    .catch(err => {
                        console.error("FULL ERROR:", err);

                        // HATA DETAYINI ALALIM
                        let errorMessage = "Connection error";
                        if (err.response) {
                            // Backend bir cevap döndü (404, 500 vs.)
                            errorMessage = `Error ${err.response.status}: ${err.response.statusText}`;
                        } else if (err.message) {
                            errorMessage = err.message;
                        }

                        Swal.fire({
                            title: 'Failed!',
                            text: errorMessage, // Hatanın tam sebebini ekrana basar
                            iconHtml: '❌',
                            ...swalOptions
                        });
                    });
            }
        });
    };

    return (
        <div style={{ maxWidth: "600px", margin: "20px auto", padding: "20px" }}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
                borderBottom: "1px solid #eee",
                paddingBottom: "10px"
            }}>
                <h2 style={{ margin: 0, color: "#2c3e50" }}>🔔 Notifications</h2>

                {notifications.length > 0 && (
                    <button
                        onClick={handleMarkAllRead}
                        style={{
                            backgroundColor: "#f8f9fa",
                            border: "1px solid #ddd",
                            color: "#555",
                            padding: "8px 12px",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            fontSize: "0.85rem",
                            transition: "background 0.2s"
                        }}
                    >
                        ✅ Mark All Read
                    </button>
                )}
            </div>

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