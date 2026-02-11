const placementService = require('../services/placementService');

exports.getAdminPlacements = async (req, res) => {
    try {
        const drives = await placementService.fetchAllDrives();
        res.status(200).json({ success: true, drives });
    } catch (error) {
        console.error("Fetch Placements Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to load placement data." });
    }
};

exports.updatePlacementStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const success = await placementService.updateStatus(id, status);
        if (!success) return res.status(404).json({ success: false, message: "Drive not found" });

        res.status(200).json({ success: true, message: `Drive status updated to ${status}` });
    } catch (error) {
        res.status(500).json({ success: false, message: "Database update failed." });
    }
};
exports.createPlacementDrive = async (req, res) => {
    try {
        const driveId = await placementService.createDrive(req.body);
        res.status(201).json({ 
            success: true, 
            message: "Placement drive created successfully!",
            driveId 
        });
    } catch (error) {
        console.error("Create Placement Error:", error.message);
        res.status(500).json({ success: false, message: "Database error: Could not save the drive." });
    }
};
exports.editPlacementDrive = async (req, res) => {
    try {
        const { id } = req.params;
        const success = await placementService.updateDrive(id, req.body);
        
        if (!success) {
            return res.status(404).json({ success: false, message: "Drive not found." });
        }

        res.status(200).json({ 
            success: true, 
            message: "Placement drive updated successfully!" 
        });
    } catch (error) {
        console.error("Edit Placement Error:", error.message);
        res.status(500).json({ success: false, message: "Database error during update." });
    }
};