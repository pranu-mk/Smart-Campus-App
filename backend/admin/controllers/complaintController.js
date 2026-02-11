const complaintService = require('../services/complaintService');

exports.getComplaints = async (req, res) => {
    try {
        const data = await complaintService.getAllComplaints();
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateComplaintAction = async (req, res) => {
    try {
        await complaintService.updateComplaint(req.params.id, req.body);
        res.status(200).json({ success: true, message: "Complaint updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};