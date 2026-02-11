const facultyService = require('../services/facultyService');

exports.getFacultyMembers = async (req, res) => {
    try {
        const data = await facultyService.getAllFaculty();
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateFacultyStatus = async (req, res) => {
    try {
        const { status } = req.body; // current status passed from frontend
        const result = await facultyService.toggleFacultyStatus(req.params.id, status);
        res.status(200).json({ 
            success: true, 
            message: `Faculty is now ${result.newStatus}`,
            newStatus: result.newStatus 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};