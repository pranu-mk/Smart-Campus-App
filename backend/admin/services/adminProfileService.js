const db = require('../../config/db');
const bcrypt = require('bcryptjs');

class AdminProfileService {
    async getProfile(adminId) {
        // Fetch specific fields only; never fetch password here
        const [rows] = await db.execute(
            "SELECT full_name, email, mobile_number, department FROM users WHERE id = ? AND role = 'admin'",
            [adminId]
        );
        return rows[0];
    }

    async updateProfile(adminId, data) {
        const { full_name, mobile_number } = data;
        const [result] = await db.execute(
            "UPDATE users SET full_name = ?, mobile_number = ? WHERE id = ? AND role = 'admin'",
            [full_name, mobile_number, adminId]
        );
        return result.affectedRows > 0;
    }

    async updatePassword(adminId, currentPassword, newPassword) {
        // 1. Get current hashed password
        const [rows] = await db.execute("SELECT password FROM users WHERE id = ?", [adminId]);
        const isMatch = await bcrypt.compare(currentPassword, rows[0].password);
        
        if (!isMatch) throw new Error("Incorrect current password");

        // 2. Hash new password and save
        const salt = await bcrypt.genSalt(10);
        const hashedBtn = await bcrypt.hash(newPassword, salt);
        
        await db.execute("UPDATE users SET password = ? WHERE id = ?", [hashedBtn, adminId]);
        return true;
    }
}

module.exports = new AdminProfileService();