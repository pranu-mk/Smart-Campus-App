// Controller logic
const navbarService = require('../services/navbarService');

exports.getNavbarInfo = async (req, res) => {
    try {
        const data = await navbarService.getNavbarData(req.user.id);
        res.status(200).json({ success: true, ...data });
    } catch (error) {
        res.status(500).json({ success: false, message: "Navbar data error" });
    }
};