import React, { createContext, useState, useEffect, useContext } from 'react';
import NotificationService from '../services/NotificationService';

const NotificationContext = createContext();

// Custom hook to use the context easily
export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [unreadCount, setUnreadCount] = useState(0);
    const user = JSON.parse(localStorage.getItem("user"));

    // Fetch unread count from server
    const refreshNotifications = () => {
        if (user) {
            NotificationService.getUnreadCount(user.userId)
                .then(res => setUnreadCount(res.data))
                .catch(err => console.error(err));
        }
    };

    useEffect(() => {
        refreshNotifications();

        // Optional: Auto-refresh every 30 seconds
        const interval = setInterval(refreshNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <NotificationContext.Provider value={{ unreadCount, refreshNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};