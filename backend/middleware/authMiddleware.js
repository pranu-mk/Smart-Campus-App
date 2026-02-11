const jwt = require('jsonwebtoken');

// --- 1. General Verification (Checking if logged in) ---
const protect = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ success: false, message: "No token, access denied" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Adds user id and role to the request
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

// --- 2. Role Specific Verification ---
const verifyRole = (requiredRole) => {
    return (req, res, next) => {
        // req.user is populated by the 'protect' middleware called before this
        if (!req.user || req.user.role !== requiredRole.toLowerCase()) {
            return res.status(403).json({ 
                success: false, 
                message: `Access denied. Authorized role: ${requiredRole}` 
            });
        }
        next();
    };
};

module.exports = { protect, verifyRole };