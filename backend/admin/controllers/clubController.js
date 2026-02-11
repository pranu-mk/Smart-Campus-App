// Ensure this path is correct based on your folder structure
const clubService = require('../services/clubService');
const db = require('../../config/db');

exports.getAdminClubs = async (req, res) => {
    try {
        const clubs = await clubService.fetchClubsAdmin();
        res.status(200).json({ success: true, clubs });
    } catch (error) {
        res.status(500).json({ success: false, message: "Fetch failed." });
    }
};
exports.updateClubDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        await clubService.updateClub(id, updateData);
        res.status(200).json({ success: true, message: "Club updated." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Update failed." });
    }
};

exports.toggleStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        await clubService.setClubStatus(id, status);

        // Fetch the updated club with the LIVE count for instant UI sync
        const [updated] = await db.execute(`
            SELECT c.*, COUNT(cm.student_id) as members 
            FROM clubs c 
            LEFT JOIN club_memberships cm ON c.id = cm.club_id 
            WHERE c.id = ? 
            GROUP BY c.id
        `, [id]);

        res.status(200).json({ success: true, club: updated[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: "Toggle failed." });
    }
};
exports.addClub = async (req, res) => {
    try {
        const clubData = req.body;
        const newClubId = await clubService.createClub(clubData);
        
        res.status(201).json({ 
            success: true, 
            message: "New club established successfully.",
            clubId: newClubId 
        });
    } catch (error) {
        console.error("Add Club Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to create new club." });
    }
};