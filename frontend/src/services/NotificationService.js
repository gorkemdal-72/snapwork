import axios from "axios";

// ENSURE PORT IS 8080
const API_URL = "http://localhost:8080/api/notifications";

class NotificationService {

    // 1. Send Notification (Optional helper)
    sendNotification(notificationRequest) {
        return axios.post(API_URL + "/send", notificationRequest);
    }

    // 2. Get My Notifications
    getMyNotifications(userId) {
        return axios.get(API_URL + "/user/" + userId);
    }

    // 3. Get Unread Count
    getUnreadCount(userId) {
        return axios.get(API_URL + "/user/" + userId + "/count");
    }

    // 4. Mark Single as Read
    markAsRead(notificationId) {
        return axios.put(API_URL + "/" + notificationId + "/read");
    }

    // 5. MARK ALL AS READ
    markAllAsRead(userId) {
        // FIXED: Point to port 8080 and use '/read-all/' path to match Controller
        return axios.put(API_URL + "/read-all/" + userId);
    }
}

export default new NotificationService();