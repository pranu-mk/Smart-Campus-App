const db = require('../../config/db');

class NavbarService {
    async getNavbarData(adminId) {
        // 1. Fetch Admin Profile Info
        const [userRows] = await db.execute(
            "SELECT full_name, profile_picture, role FROM users WHERE id = ?",
            [adminId]
        );

        // 2. Count Unread Notifications
        const [notifRows] = await db.execute(
            "SELECT COUNT(*) as unreadCount FROM notifications WHERE user_id = ? AND is_read = 0",
            [adminId]
        );

        return {
            admin: userRows[0],
            unreadNotifications: notifRows[0].unreadCount || 0
        };
    }
}

module.exports = new NavbarService();