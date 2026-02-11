const dashboardService = require('../services/dashboardService');

exports.getDashboardData = async (req, res) => {
    try {
        const stats = await dashboardService.getGlobalStats();
        const charts = await dashboardService.getChartsData();
        const activity = await dashboardService.getRecentActivity();

        res.status(200).json({
            success: true,
            data: { 
                stats, 
                charts, 
                activity, 
                serverTime: new Date() 
            }
        });
    } catch (error) {
        console.error("Admin Dashboard Controller Error:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to retrieve dashboard data' 
        });
    }
};