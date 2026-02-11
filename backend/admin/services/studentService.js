const db = require('../../config/db');

class StudentService {
    async getAllStudents() {
        // FIX: Ensure column names match the USERS table exactly (prn, year, etc.)
        const [students] = await db.execute(`
            SELECT 
                u.id, 
                u.full_name as name, 
                u.email, 
                u.mobile_number as phone, 
                u.prn as enrollmentNo, 
                u.department, 
                u.course, 
                u.year as semester,
                u.profile_picture as avatar, 
                u.created_at as joinedDate,
                (SELECT COUNT(*) FROM complaints WHERE user_id = u.id) as complaintsCount,
                'active' as status
            FROM users u
            WHERE u.role = 'student'
            ORDER BY u.created_at DESC
        `);
        return students;
    }

    async updateStudent(id, data) {
        const { department, course, year } = data;
        await db.execute(
            "UPDATE users SET department = ?, course = ?, year = ? WHERE id = ?",
            [department, course, year, id]
        );
        return { success: true };
    }

    async getStudentComplaints(studentId) {
        // FIX: Mapping 'subject' to 'title' to match frontend expectations
        const [complaints] = await db.execute(`
            SELECT 
                c.id,
                c.subject as title,
                c.description,
                c.status,
                c.priority,
                c.created_at,
                f.full_name as facultyName
            FROM complaints c
            LEFT JOIN users f ON c.assigned_to = f.id
            WHERE c.user_id = ?
            ORDER BY c.created_at DESC
        `, [studentId]);
        return complaints;
    }
}

module.exports = new StudentService();