const db = require('../../config/db');

class ComplaintService {
    async getAllComplaints() {
        const [rows] = await db.execute(`
            SELECT 
                c.id, c.complaint_id as customId, c.subject as title, c.description, 
                c.category, c.sub_category as subCategory, c.status, c.priority, 
                c.created_at as createdAt, c.updated_at as updatedAt,
                u.full_name as studentName, u.department, u.prn as studentPrn,
                f.full_name as facultyName, f.id as assignedTo,
                c.internal_notes as internalNotes, c.faculty_reply as facultyReply
            FROM complaints c
            JOIN users u ON c.user_id = u.id
            LEFT JOIN users f ON c.assigned_to = f.id
            ORDER BY c.created_at DESC
        `);
        return rows;
    }

    async updateComplaint(id, data) {
        const { status, priority, assigned_to, internal_notes } = data;
        
        // Ensure atomic update. 
        // 6 Placeholders: assigned_to(check), status, priority, assigned_to(set), internal_notes, id
        const query = `
            UPDATE complaints SET 
                status = CASE 
                    WHEN ? IS NOT NULL AND status = 'Pending' THEN 'In-Progress'
                    ELSE COALESCE(?, status)
                END, 
                priority = COALESCE(?, priority), 
                assigned_to = COALESCE(?, assigned_to),
                internal_notes = COALESCE(?, internal_notes),
                updated_at = NOW()
            WHERE id = ?
        `;

        const params = [
            assigned_to || null, 
            status || null,      
            priority || null,    
            assigned_to || null, 
            internal_notes !== undefined ? internal_notes : null, 
            id                   
        ];

        const [result] = await db.execute(query, params);
        
        if (result.affectedRows === 0) {
            throw new Error("Complaint update failed.");
        }
        
        return { success: true };
    }
}

module.exports = new ComplaintService();