const db = require('../../config/db');

class AdminPlacementService {
    async fetchAllDrives() {
        // We use a LEFT JOIN to count actual applications from the database
        const [rows] = await db.execute(`
            SELECT 
                p.id, 
                p.company_name as company, 
                p.role, 
                p.eligibility,
                p.package_lpa as package, 
                p.status,
                DATE_FORMAT(p.deadline, '%Y-%m-%d') as deadline,
                DATE_FORMAT(p.created_at, '%Y-%m-%d') as driveDate,
                COUNT(pa.student_id) as registrations
            FROM placements p
            LEFT JOIN placement_applications pa ON p.id = pa.placement_id
            GROUP BY p.id
            ORDER BY p.created_at DESC
        `);
        return rows;
    }

    async updateStatus(id, status) {
        // This updates the ENUM column we just created
        const [result] = await db.execute(
            "UPDATE placements SET status = ? WHERE id = ?",
            [status, id]
        );
        return result.affectedRows > 0;
    }
async updateDrive(id, data) {
        const { company, role, package: pkg, eligibility, driveDate, registrationDeadline } = data;
        
        // Use COALESCE to keep existing values if some fields are missing in the request
        const [result] = await db.execute(
            `UPDATE placements SET 
                company_name = COALESCE(?, company_name),
                role = COALESCE(?, role),
                package_lpa = COALESCE(?, package_lpa),
                eligibility = COALESCE(?, eligibility),
                created_at = COALESCE(?, created_at),
                deadline = COALESCE(?, deadline)
             WHERE id = ?`,
            [
                company, 
                role, 
                pkg ? parseFloat(pkg) : null, 
                eligibility, 
                driveDate, 
                registrationDeadline, 
                id
            ]
        );
        return result.affectedRows > 0;
    }

    async createDrive(data) {
        const { company, role, package: pkg, eligibility, driveDate, registrationDeadline } = data;
        
        // Maps frontend keys to database columns: company -> company_name, package -> package_lpa
        const [result] = await db.execute(
            `INSERT INTO placements 
            (company_name, role, package_lpa, eligibility, created_at, deadline, status) 
            VALUES (?, ?, ?, ?, ?, ?, 'Upcoming')`,
            [
                company, 
                role, 
                parseFloat(pkg) || 0, // Ensures package is a number for DECIMAL column
                eligibility, 
                driveDate, 
                registrationDeadline
            ]
        );
        return result.insertId;
    }
}

module.exports = new AdminPlacementService();