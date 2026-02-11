const db = require('../config/db');

// 1. Create a new Lost/Found post
exports.createPost = async (req, res) => {
    try {
        const userId = req.user.id;
        const { type, title, description, category, item_date } = req.body;

        const [result] = await db.execute(
            `INSERT INTO lost_found_items (user_id, type, title, description, category, item_date) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [userId, type, title, description, category, item_date]
        );

        res.status(201).json({
            success: true,
            message: "Post created successfully",
            postId: result.insertId
        });
    } catch (error) {
        console.error("Lost & Found Create Error:", error);
        res.status(500).json({ success: false, message: "Failed to create post" });
    }
};

// 2. Fetch ALL public posts (for the main board)
exports.getAllPosts = async (req, res) => {
    try {
        const [posts] = await db.execute(
            `SELECT lf.*, u.full_name as posted_by 
             FROM lost_found_items lf 
             JOIN users u ON lf.user_id = u.id 
             ORDER BY lf.created_at DESC`
        );

        res.status(200).json({ success: true, posts });
    } catch (error) {
        console.error("Lost & Found Fetch Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch posts" });
    }
};

// 3. Claim a found item
exports.claimItem = async (req, res) => {
    try {
        const claimantId = req.user.id; // Person clicking "Claim"
        const { id } = req.params; // The Item ID from the URL

        // 1. Get the original poster's ID and item title
        const [itemRows] = await db.execute(
            `SELECT user_id, title FROM lost_found_items WHERE id = ?`,
            [id]
        );

        if (itemRows.length === 0) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }

        const finderId = itemRows[0].user_id;
        const itemTitle = itemRows[0].title;

        // 2. Update the item status to 'Claimed'
        await db.execute(
            `UPDATE lost_found_items SET status = 'Claimed' WHERE id = ?`,
            [id]
        );

        // 3. Create a notification for the person who FOUND the item
        // Note: Using your existing notifications table structure
        await db.execute(
            `INSERT INTO notifications (user_id, title, message, type) 
             VALUES (?, 'Item Claimed!', ?, 'info')`,
            [
                finderId, 
                `Someone has claimed the "${itemTitle}" you found. Please visit the student office for verification.`
            ]
        );

        res.status(200).json({
            success: true,
            message: "Claim request submitted. Finder has been notified."
        });

    } catch (error) {
        console.error("Claim Error:", error);
        res.status(500).json({ success: false, message: "Server error during claim" });
    }
};