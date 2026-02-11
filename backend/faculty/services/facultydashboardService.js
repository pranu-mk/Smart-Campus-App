const db = require('../../config/db');

/**
 * 1. GET ASSIGNED COMPLAINTS
 * Returns a consistent format to prevent frontend crashes.
 */
exports.getAssignedComplaints = async (req, res) => {
    try {
        const facultyId = req.user.id;

        const [complaints] = await db.execute(`
            SELECT 
                c.id as db_id,
                c.complaint_id as id,
                u.full_name as studentName,
                u.department,
                c.category as type,
                c.priority,
                DATE_FORMAT(c.created_at, '%Y-%m-%d') as date,
                c.status,
                c.description,
                c.faculty_reply as facultyResponse,
                c.internal_notes as internalNote
            FROM complaints c
            JOIN users u ON c.user_id = u.id
            WHERE c.assigned_to = ?
            ORDER BY c.created_at DESC`, 
            [facultyId]
        );

        // Map status to match frontend exactly
        const mappedData = complaints.map(c => ({
            ...c,
            // Ensure "In-Progress" from DB matches "In Progress" in UI if necessary,
            // or use the synchronized mapping in the frontend fix provided.
            status: c.status || 'Pending',
            priority: c.priority || 'Medium'
        }));

        res.json({ success: true, data: mappedData });
    } catch (error) {
        console.error('Fetch Assigned Complaints Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};