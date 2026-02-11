const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- 1. LOGIN LOGIC ---
const login = async (req, res) => {
    try {
        const { identifier, password } = req.body;
        let selectedRole = req.body.role; 

        if (!identifier || !password) {
            return res.status(400).json({ success: false, message: "Required fields missing." });
        }

        const [rows] = await db.execute("SELECT * FROM users WHERE username = ? OR email = ?", [identifier, identifier]);
        const user = rows[0];

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: "Invalid credentials." });
        }

        if (user.status && user.status.toLowerCase() === 'blocked') {
            return res.status(403).json({ 
                success: false, 
                message: "Access Denied. This account has been disabled by the administrator." 
            });
        }

        if (!selectedRole) selectedRole = user.role;
        if (user.role.toLowerCase() !== selectedRole.toLowerCase()) {
            return res.status(401).json({ success: false, message: `Please select the correct role.` });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role.toLowerCase() }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        return res.json({
            success: true,
            token,
            role: user.role.toLowerCase(),
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            prn: user.prn,
            department: user.department,
            course: user.course,
            year: user.year,
            profile_picture: user.profile_picture,
            status: user.status 
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// --- 2. REGISTER LOGIC ---
const register = async (req, res) => {
    try {
        const { 
            role, fullName, email, mobile, username, password, 
            studentId, department, course, yearSemester, 
            facultyId, designation, photo, profilePicture 
        } = req.body;

        const [existing] = await db.execute("SELECT id FROM users WHERE username = ? OR email = ?", [username, email]);
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: "Username or Email already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO users (
                role, full_name, email, mobile_number, username, password, 
                prn, course, year, faculty_id, designation, department, profile_picture, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
        `;

        const values = [
            role, fullName, email, mobile, username, hashedPassword, 
            studentId || null, course || null, yearSemester || null, 
            facultyId || null, designation || null, department ?? null, 
            (photo || profilePicture) ?? null
        ];

        await db.execute(sql, values);
        res.status(201).json({ success: true, message: "Registration successful!" });
    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ success: false, message: "Registration failed" });
    }
};

// --- 3. UPDATE PROFILE LOGIC (FIXED FOR STUDENT DASHBOARD) ---
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        // Destructure incoming keys
        const { fullName, mobileNumber, username, department, profilePicture } = req.body;

        // Convert undefined to null to prevent "Bind parameters must not contain undefined" error
        const sqlParams = [
            fullName || null,
            mobileNumber || null,
            username || null,
            department || null,
            profilePicture || null,
            userId
        ];

        const sql = `
            UPDATE users 
            SET full_name = COALESCE(?, full_name), 
                mobile_number = COALESCE(?, mobile_number), 
                username = COALESCE(?, username), 
                department = COALESCE(?, department), 
                profile_picture = COALESCE(?, profile_picture) 
            WHERE id = ?
        `;

        await db.execute(sql, sqlParams);

        const [updatedRows] = await db.execute(
            "SELECT id, role, full_name, email, prn, department, course, year, mobile_number, profile_picture, status FROM users WHERE id = ?", 
            [userId]
        );

        res.json({ success: true, user: updatedRows[0] });
    } catch (err) {
        console.error("SQL ERROR:", err.message);
        res.status(500).json({ success: false, message: "Update failed" });
    }
};
// --- 4. CHANGE PASSWORD LOGIC ---
const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { oldPassword, newPassword } = req.body;

        const [rows] = await db.execute("SELECT password FROM users WHERE id = ?", [userId]);
        const isMatch = await bcrypt.compare(oldPassword, rows[0].password);

        if (!isMatch) return res.status(401).json({ success: false, message: "Incorrect password" });

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await db.execute("UPDATE users SET password = ? WHERE id = ?", [hashedNewPassword, userId]);

        res.json({ success: true, message: "Password updated!" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Password change failed" });
    }
};

module.exports = { login, register, updateProfile, changePassword };