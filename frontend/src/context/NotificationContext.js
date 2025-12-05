import React, { createContext, useState, useEffect } from 'react';
import NotificationService from '../services/NotificationService';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [unreadCount, setUnreadCount] = useState(0);
    const user = JSON.parse(localStorage.getItem("user"));

    // Bildirim sayısını sunucudan çek
    const refreshNotifications = () => {
        if (user) {
            NotificationService.getUnreadCount(user.userId)
                .then(res => setUnreadCount(res.data))
                .catch(err => console.error(err));
        }
    };

    // Uygulama ilk açıldığında kontrol et
    useEffect(() => {
        refreshNotifications();

        // İstersen her 30 saniyede bir otomatik kontrol ekleyebilirsin:
        const interval = setInterval(refreshNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <NotificationContext.Provider value={{ unreadCount, refreshNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};