const db = require('../../config/db');

exports.getAllItems = async (req, res) => {
    try {
        const [items] = await db.execute(`
            SELECT id, title as itemName, description, category, location, 
            status, item_date, created_at 
            FROM lost_found_items 
            ORDER BY created_at DESC
        `);
        res.status(200).json({ success: true, items });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateItemStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        await db.execute(
            "UPDATE lost_found_items SET status = ? WHERE id = ?",
            [status, id]
        );
        
        res.status(200).json({ success: true, message: "Status updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.reportItem = async (req, res) => {
    try {
        const { itemName, description, category, location, status } = req.body;
        const userId = req.user.id; 

        // Match schema: table uses 'title'
        await db.execute(
            `INSERT INTO lost_found_items (user_id, title, description, category, location, status, item_date) 
            VALUES (?, ?, ?, ?, ?, ?, CURDATE())`,
            [userId, itemName, description, category, location, status]
        );

        res.status(201).json({ success: true, message: "Item reported successfully" });
    } catch (error) {
        console.error("Report Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to save item" });
    }
};