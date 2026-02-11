const noticeService = require('../services/noticeService');

exports.fetchNotices = async (req, res) => {
    try {
        const notices = await noticeService.getAllNotices();
        res.status(200).json({ success: true, notices });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to load notices." });
    }
};

exports.addNotice = async (req, res) => {
    try {
        const noticeId = await noticeService.createNotice(req.body);
        res.status(201).json({ success: true, message: "Notice published!", noticeId });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error saving notice." });
    }
};

exports.editNotice = async (req, res) => {
    try {
        await noticeService.updateNotice(req.params.id, req.body);
        res.status(200).json({ success: true, message: "Notice updated successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Update failed." });
    }
};

exports.removeNotice = async (req, res) => {
    try {
        await noticeService.deleteNotice(req.params.id);
        res.status(200).json({ success: true, message: "Notice deleted permanently." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Deletion failed." });
    }
};