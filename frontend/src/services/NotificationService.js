import axios from "axios";

const API_URL = "http://localhost:8080/api/notifications";

// 1. Get My Notifications
const getMyNotifications = (userId) => {
    return axios.get(API_URL + "/user/" + userId);
};

// 2. Get Unread Count (For Badge)
const getUnreadCount = (userId) => {
    return axios.get(API_URL + "/user/" + userId + "/count");
};

// 3. Mark as Read
const markAsRead = (notificationId) => {
    return axios.put(API_URL + "/" + notificationId + "/read");
};

const NotificationService = {
    getMyNotifications,
    getUnreadCount,
    markAsRead
};

export default NotificationService;