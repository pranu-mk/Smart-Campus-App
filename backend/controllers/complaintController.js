const db = require('../config/db');

// Generate unique complaint ID
const generateComplaintId = () => {
    const prefix = 'CMP';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return `${prefix}${timestamp}${random}`;
};
const getStudentComplaints = async (req, res) => {
    try {
        const userId = req.user.id;
        const [rows] = await db.execute(`
            SELECT 
                c.complaint_id as id,
                c.subject as title,
                c.status,
                c.priority,
                c.created_at as date,
                f.full_name as assignedFaculty,
                c.faculty_reply as feedback
            FROM complaints c
            LEFT JOIN users f ON c.assigned_to = f.id
            WHERE c.user_id = ?
            ORDER BY c.created_at DESC
        `, [userId]);

        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch complaints' });
    }
};
// Create new complaint
exports.createComplaint = async (req, res) => {
    // 1. Get a connection for the transaction
    const connection = await db.getConnection();
    
    try {
        const { category, subCategory, subject, description } = req.body;
        const userId = req.user.id;
        const filePath = req.file ? req.file.path : null;

        // Validation Check
        if (!category || !subCategory || !subject || !description) {
            // Delete file if validation fails to save space
            if (req.file) fs.unlinkSync(req.file.path); 
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const complaintId = generateComplaintId();

        // 2. START TRANSACTION
        await connection.beginTransaction();

        // 3. Insert Complaint
        const [complaintResult] = await connection.execute(
            `INSERT INTO complaints (complaint_id, user_id, category, sub_category, subject, description, file_path) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [complaintId, userId, category, subCategory, subject, description, filePath]
        );

        // 4. Insert Notification
        await connection.execute(
            `INSERT INTO notifications (user_id, title, message, type, related_id) 
             VALUES (?, ?, ?, ?, ?)`,
            [
                userId,
                'Complaint Submitted Successfully',
                `Your complaint ${complaintId} has been submitted and is under review.`,
                'complaint',
                complaintResult.insertId
            ]
        );

        // 5. COMMIT (Save everything forever)
        await connection.commit();

        res.status(201).json({
            success: true,
            message: "Complaint submitted successfully",
            complaintId,
            status: "Pending"
        });

    } catch (error) {
        // 6. ROLLBACK (Undo everything if an error occurs)
        await connection.rollback();
        
        // Delete the file if it was uploaded but the DB save failed
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        console.error('Create complaint error:', error);
        res.status(500).json({ success: false, message: "Failed to submit complaint" });
    } finally {
        // 7. ALWAYS release the connection back to the pool
        connection.release();
    }
};

// Get user's complaints
exports.getUserComplaints = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Ensure these are strictly numbers
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Use .query instead of .execute for queries with LIMIT/OFFSET 
        // to avoid prepared statement type-casting issues
        const [complaints] = await db.query(
            `SELECT complaint_id, category, sub_category, subject, description, status, 
                    priority, created_at, updated_at 
             FROM complaints 
             WHERE user_id = ? 
             ORDER BY created_at DESC 
             LIMIT ? OFFSET ?`,
            [userId, limit, offset]
        );

        // Get total count for pagination
        const [countResult] = await db.execute(
            'SELECT COUNT(*) as total FROM complaints WHERE user_id = ?',
            [userId]
        );

        const total = countResult[0].total;
        const totalPages = Math.ceil(total / limit);

        res.json({
            success: true,
            complaints,
            pagination: {
                currentPage: page,
                totalPages,
                totalComplaints: total,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });

    } catch (error) {
        console.error('Get complaints error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch complaints"
        });
    }
};

// Get complaint statistics
exports.getComplaintStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const [stats] = await db.execute(
            `SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status = 'In-Progress' THEN 1 ELSE 0 END) as inProgress,
                SUM(CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END) as resolved,
                SUM(CASE WHEN status = 'Closed' THEN 1 ELSE 0 END) as closed
             FROM complaints 
             WHERE user_id = ?`,
            [userId]
        );

        res.json({
            success: true,
            stats: stats[0]
        });

    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch statistics"
        });
    }
};

// Get complaint by ID
exports.getComplaintById = async (req, res) => {
    try {
        const { complaintId } = req.params;
        const userId = req.user.id;

        const [complaints] = await db.execute(
            `SELECT c.*, u.full_name as user_name 
             FROM complaints c 
             JOIN users u ON c.user_id = u.id 
             WHERE c.complaint_id = ? AND c.user_id = ?`,
            [complaintId, userId]
        );

        if (complaints.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }

        res.json({
            success: true,
            complaint: complaints[0]
        });

    } catch (error) {
        console.error('Get complaint by ID error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch complaint"
        });
    }
};

// Get recent complaints for dashboard
exports.getRecentComplaints = async (req, res) => {
    try {
        const userId = req.user.id;
        const limit = parseInt(req.query.limit) || 5;

        const [complaints] = await db.execute(
            `SELECT complaint_id, category, subject, status, 
                    DATE_FORMAT(created_at, '%b %d, %Y') as date
             FROM complaints 
             WHERE user_id = ? 
             ORDER BY created_at DESC 
             LIMIT ?`,
            [userId, limit]
        );

        res.json({
            success: true,
            complaints
        });

    } catch (error) {
        console.error('Get recent complaints error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch recent complaints"
        });
    }
};