import axios from 'axios';

// Get base URL from environment or default to localhost
const API_URL = import.meta.env.VITE_API_URL || 'https://smart-campus-backend-app.onrender.com/api';

/**
 * Fetches the complete summary data for the Admin Command Center.
 * Includes global stats, chart data, and recent campus activity.
 */
export const fetchDashboardSummary = async () => {
    try {
        const token = localStorage.getItem('token');
        
        // Safety check for token
        if (!token) {
            throw new Error('Authentication token not found');
        }

        const response = await axios.get(`${API_URL}/admin/summary`, {
            headers: { 
                Authorization: `Bearer ${token}` 
            }
        });

        // Ensure we return the data property from the API response structure
        return response.data;
    } catch (error: any) {
        console.error("Error fetching admin dashboard summary:", error.response?.data || error.message);
        throw error;
    }
};