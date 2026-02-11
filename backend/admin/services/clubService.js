const db = require('../../config/db');

class AdminClubService {
    async fetchClubsAdmin() {
        // SQL JOIN to count real-time memberships from the mapping table
        const [rows] = await db.execute(`
            SELECT 
                c.id, 
                c.name, 
                c.description, 
                c.category, 
                COUNT(cm.student_id) as members, -- This is now the live dynamic count
                c.events_count as upcomingEvents, 
                c.image_emoji as emoji,
                c.status,
                c.president_name as president,
                DATE_FORMAT(c.created_at, '%Y') as established
            FROM clubs c
            LEFT JOIN club_memberships cm ON c.id = cm.club_id
            GROUP BY c.id
            ORDER BY c.name ASC
        `);
        return rows;
    }

    async createClub(data) {
        const { name, description, category, president, emoji } = data;
        const [result] = await db.execute(
            `INSERT INTO clubs (name, description, category, president_name, image_emoji, status) 
             VALUES (?, ?, ?, ?, ?, 'active')`,
            [name, description, category, president, emoji || '🏢']
        );
        return result.insertId;
    }

    async updateClub(id, data) {
        const { description, president } = data;
        return await db.execute(
            `UPDATE clubs SET 
                description = COALESCE(?, description),
                president_name = COALESCE(?, president_name)
             WHERE id = ?`,
            [description, president, id]
        );
    }

    async setClubStatus(id, status) {
        return await db.execute(
            "UPDATE clubs SET status = ? WHERE id = ?",
            [status, id]
        );
    }
}

module.exports = new AdminClubService();