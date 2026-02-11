const db = require('../../config/db');

class DashboardService {
    async getGlobalStats() {
        const [users] = await db.execute('SELECT role, COUNT(*) as count FROM users GROUP BY role');
        const [complaints] = await db.execute('SELECT status, COUNT(*) as count FROM complaints GROUP BY status');
        const [totalC] = await db.execute('SELECT COUNT(*) as count FROM complaints');
        
        const stats = {
            totalStudents: users.find(u => u.role === 'student')?.count || 0,
            totalFaculty: users.find(u => u.role === 'faculty')?.count || 0,
            totalComplaints: totalC[0].count || 0,
            pending: complaints.find(c => c.status === 'Pending')?.count || 0,
            resolved: complaints.find(c => c.status === 'Resolved')?.count || 0,
            escalated: complaints.find(c => c.status === 'Closed')?.count || 0, // Using 'Closed' as Escalated/Final state
        };

        stats.resolutionRate = stats.totalComplaints > 0 
            ? Math.round((stats.resolved / stats.totalComplaints) * 100) 
            : 0;

        return stats;
    }

    async getChartsData() {
        // Monthly trends
        const [trends] = await db.execute(`
            SELECT DATE_FORMAT(created_at, '%b') as month, COUNT(*) as complaints,
            SUM(CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END) as resolved
            FROM complaints 
            GROUP BY month, MONTH(created_at)
            ORDER BY MONTH(created_at) ASC 
            LIMIT 6
        `);

        // Category distribution
        const [categories] = await db.execute(`
            SELECT category as name, COUNT(*) as value FROM complaints GROUP BY category
        `);

        // Department distribution (Joining users to get department)
        const [depts] = await db.execute(`
            SELECT u.department as dept, COUNT(c.id) as count 
            FROM complaints c
            JOIN users u ON c.user_id = u.id
            WHERE u.department IS NOT NULL
            GROUP BY u.department
        `);

        return { trends, categories, depts };
    }

    async getRecentActivity() {
        // FIX: Changed c.title to c.subject and c.student_id to c.user_id
        const [recentComplaints] = await db.execute(`
            SELECT c.id, c.subject as title, c.status, c.priority, u.full_name as studentName 
            FROM complaints c 
            JOIN users u ON c.user_id = u.id 
            ORDER BY c.created_at DESC LIMIT 4
        `);

        // Events
        const [events] = await db.execute(`
            SELECT id, title, event_date as date, location as venue 
            FROM events 
            ORDER BY event_date ASC LIMIT 3
        `);

        // FIX: Changed table name to 'placements' and columns to 'company_name'/'package_lpa'
        const [placements] = await db.execute(`
            SELECT id, company_name as company, role, package_lpa as package 
            FROM placements 
            ORDER BY created_at DESC LIMIT 3
        `);

        return { recentComplaints, upcomingEvents: events, upcomingPlacements: placements };
    }
}

module.exports = new DashboardService();