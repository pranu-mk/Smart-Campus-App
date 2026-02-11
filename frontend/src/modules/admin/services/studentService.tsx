import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getStudents = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/admin/students`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const getStudentComplaints = async (id: string) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/admin/students/${id}/complaints`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};