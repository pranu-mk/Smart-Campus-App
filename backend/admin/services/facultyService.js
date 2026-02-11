const db = require('../../config/db');

class FacultyService {
    async getAllFaculty() {
        // Fetch real status from DB to ensure it matches the Auth logic
        const [faculty] = await db.execute(`
            SELECT 
                u.id, u.full_name as name, u.email, u.mobile_number as phone, 
                u.department, u.designation, u.profile_picture as avatar, u.role,
                u.status,
                4.5 as rating,
                (SELECT COUNT(*) FROM complaints WHERE assigned_to = u.id) as assignedComplaints,
                (SELECT COUNT(*) FROM complaints WHERE assigned_to = u.id AND status = 'Resolved') as resolvedComplaints
            FROM users u
            WHERE u.role = 'faculty'
            ORDER BY u.created_at DESC
        `);
        return faculty;
    }

    async toggleFacultyStatus(id, currentStatus) {
        // Strict toggle logic
        const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
        
        const [result] = await db.execute(
            "UPDATE users SET status = ? WHERE id = ? AND role = 'faculty'",
            [newStatus, id]
        );

        if (result.affectedRows === 0) {
            throw new Error("Faculty member not found or update failed.");
        }
        
        return { success: true, newStatus };
    }
}

module.exports = new FacultyService();