const db = require('../../config/db');

class NoticeService {
    async getAllNotices() {
        const [rows] = await db.execute(
            "SELECT id, title, content, type as category, target_role as visibility, created_at as date FROM notices ORDER BY created_at DESC"
        );
        return rows;
    }
async createNotice(data) {
    const { title, content, category, visibility } = data;
    
    // Ensure the category being sent exists in your ENUM: 
    // ('general','academic','event','placement','urgent')
    const validCategory = ['general', 'academic', 'event', 'placement', 'urgent'].includes(category) 
        ? category 
        : 'general';

    const [result] = await db.execute(
        "INSERT INTO notices (title, content, type, target_role, is_active) VALUES (?, ?, ?, ?, 1)",
        [title, content, validCategory, visibility]
    );
    return result.insertId;
}
    async updateNotice(id, data) {
        const { title, content, category, visibility } = data;
        const [result] = await db.execute(
            "UPDATE notices SET title = ?, content = ?, type = ?, target_role = ? WHERE id = ?",
            [title, content, category, visibility, id]
        );
        return result.affectedRows > 0;
    }

    async deleteNotice(id) {
        const [result] = await db.execute("DELETE FROM notices WHERE id = ?", [id]);
        return result.affectedRows > 0;
    }
}

module.exports = new NoticeService();