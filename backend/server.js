const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- FIXED CORS CONFIGURATION ---
app.use(cors({
    origin: ['http://localhost:8080',  "https://smart-campus-app.vercel.app"],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], 
    allowedHeaders: ['Content-Type', 'Authorization']
})); 

// --- JSON PARSING MIDDLEWARE ---
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// --- REQUEST LOGGER ---
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} to ${req.url}`);
    next();
});

// --- MIDDLEWARE ---
const { protect, verifyRole } = require('./middleware/authMiddleware');

// --- REGISTER ALL ROUTES ---

// 1. Auth Routes
app.use('/api/auth', require('./routes/authRoutes'));

// 2. Admin Specific Routes
const adminDashboardRoutes = require('./admin/routes/dashboardRoutes');
const adminStudentRoutes = require('./admin/routes/studentRoutes');
const adminFacultyRoutes = require('./admin/routes/facultyRoutes');
const adminComplaintRoutes = require('./admin/routes/complaintRoutes');
const adminHelpdeskRoutes = require('./admin/routes/helpdeskRoutes');
const adminLostFoundRoutes = require('./admin/routes/lostFoundRoutes');
const adminEventRoutes = require('./admin/routes/eventRoutes');
const adminClubRoutes = require('./admin/routes/clubRoutes'); 
const adminPollRoutes = require('./admin/routes/pollRoutes');
const adminPlacementRoutes = require('./admin/routes/placementRoutes');
const adminNoticeRoutes = require('./admin/routes/noticeRoutes');
const adminProfileRoutes = require('./admin/routes/adminProfileRoutes');
const adminNavbarRoutes = require('./admin/routes/navbarRoutes'); // New Admin Navbar Route

// Applying protection and role verification to all admin routes
app.use('/api/admin', protect, verifyRole('admin'), adminDashboardRoutes);
app.use('/api/admin/students', protect, verifyRole('admin'), adminStudentRoutes);
app.use('/api/admin/faculty', protect, verifyRole('admin'), adminFacultyRoutes);
app.use('/api/admin/complaints', protect, verifyRole('admin'), adminComplaintRoutes);
app.use('/api/admin/helpdesk', protect, verifyRole('admin'), adminHelpdeskRoutes);
app.use('/api/admin/lost-found', protect, verifyRole('admin'), adminLostFoundRoutes);
app.use('/api/admin/events', protect, verifyRole('admin'), adminEventRoutes);
app.use('/api/admin/clubs', protect, verifyRole('admin'), adminClubRoutes); 
app.use('/api/admin/polls', protect, verifyRole('admin'), adminPollRoutes);
app.use('/api/admin/placements', protect, verifyRole('admin'), adminPlacementRoutes);
app.use('/api/admin/notices', protect, verifyRole('admin'), adminNoticeRoutes);
app.use('/api/admin/profile', protect, verifyRole('admin'), adminProfileRoutes);
app.use('/api/admin/navbar', protect, verifyRole('admin'), adminNavbarRoutes); // Registered Navbar path

// 3. Faculty Specific Routes
app.use('/api/faculty', protect, verifyRole('faculty'), require('./faculty/routes/facultyDashboardRoutes'));

// 4. Student Specific Routes
app.use('/api/student', protect, verifyRole('student'), require('./routes/studentRoutes'));

// 5. General Module Routes
app.use('/api/placements', require('./routes/placement'));
app.use('/api/subs', require('./routes/subRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));

// --- STATIC FILES ---
app.use('/uploads', express.static('uploads'));

// --- GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Something went wrong on the server!' });
});

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('🚀 CampusCanvas Backend is running');
});

app.listen(PORT, () => {
    console.log(`🚀 Server is sprinting on http://localhost:${PORT}`);
});