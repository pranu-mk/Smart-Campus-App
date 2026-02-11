const db = require('../../config/db');

class HelpdeskService {
    async getAllTickets() {
        const [rows] = await db.execute(`
            SELECT 
                t.id, t.ticket_custom_id as customId, t.subject as title, 
                t.category, t.status, t.priority, t.created_at as createdAt,
                COALESCE(u.full_name, 'Unknown User') as userName, 
                COALESCE(u.role, 'N/A') as userRole, 
                COALESCE(u.department, 'N/A') as department,
                t.description
            FROM helpdesk_tickets t
            LEFT JOIN users u ON t.user_id = u.id
            ORDER BY t.created_at DESC
        `);

        for (let ticket of rows) {
            const [messages] = await db.execute(`
                SELECT sender_role as sender, message, 
                DATE_FORMAT(created_at, '%h:%i %p') as time,
                sender_name as senderName
                FROM helpdesk_messages 
                WHERE ticket_id = ? 
                ORDER BY created_at ASC`, 
                [ticket.id]
            );
            ticket.messages = messages;
        }
        return rows;
    }

    async getHelpdeskSummary() {
        const [stats] = await db.execute(`
            SELECT 
                COUNT(CASE WHEN status IN ('Open', 'Pending') THEN 1 END) as openTickets,
                COUNT(CASE WHEN status = 'In Progress' THEN 1 END) as inProgress,
                COUNT(CASE WHEN DATE(created_at) = CURDATE() AND status = 'Resolved' THEN 1 END) as resolvedToday
            FROM helpdesk_tickets
        `);
        return stats[0];
    }

    async updateTicket(id, data) {
        const { status, admin_reply, admin_name } = data;
        
        await db.execute(
            "UPDATE helpdesk_tickets SET status = COALESCE(?, status) WHERE id = ?",
            [status || null, id]
        );
        
        if (admin_reply) {
            await db.execute(
                "INSERT INTO helpdesk_messages (ticket_id, sender_role, sender_name, message) VALUES (?, 'faculty', ?, ?)",
                [id, admin_name || 'Admin Support', admin_reply]
            );
        }
        return { success: true };
    }
}

module.exports = new HelpdeskService();