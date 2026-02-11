const profileService = require('../services/adminProfileService');

exports.getAdminProfile = async (req, res) => {
    try {
        const profile = await profileService.getProfile(req.user.id);
        res.status(200).json({ success: true, profile });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error fetching profile" });
    }
};

exports.updateAdminProfile = async (req, res) => {
    try {
        await profileService.updateProfile(req.user.id, req.body);
        res.status(200).json({ success: true, message: "Profile updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Update failed" });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        await profileService.updatePassword(req.user.id, currentPassword, newPassword);
        res.status(200).json({ success: true, message: "Password updated" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};