/* =====================================================
   1. DATABASE
===================================================== */
CREATE DATABASE IF NOT EXISTS campus_canvas_db;
USE campus_canvas_db;

/* =====================================================
   2. USERS TABLE
===================================================== */
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role ENUM('student', 'faculty', 'admin') NOT NULL,

    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    mobile_number VARCHAR(15) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,

    -- Student-specific
    prn VARCHAR(50) UNIQUE,
    course VARCHAR(100),
    year VARCHAR(20),

    -- Faculty-specific
    faculty_id VARCHAR(50) UNIQUE,
    designation VARCHAR(100),

    -- Common
    department VARCHAR(100),
    profile_picture LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* =====================================================
   3. EMAIL SUBSCRIBERS
===================================================== */
CREATE TABLE IF NOT EXISTS email_subscribers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    status ENUM('active', 'unsubscribed') DEFAULT 'active',
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscriber_email ON email_subscribers(email);

/* =====================================================
   4. CAMPUS UPDATES
===================================================== */
CREATE TABLE IF NOT EXISTS campus_updates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category ENUM('notice', 'holiday', 'announcement', 'update') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* =====================================================
   5. COMPLAINTS SYSTEM
===================================================== */
CREATE TABLE complaints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    complaint_id VARCHAR(20) UNIQUE NOT NULL,
    user_id INT NOT NULL,

    category ENUM('hostel', 'exam', 'faculty', 'campus', 'lost', 'helpdesk') NOT NULL,
    sub_category VARCHAR(100) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,

    file_path VARCHAR(500),
    status ENUM('Pending', 'In-Progress', 'Resolved', 'Closed') DEFAULT 'Pending',
    priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
    assigned_to INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

/* =====================================================
   6. NOTICES
===================================================== */
CREATE TABLE IF NOT EXISTS notices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,

    type ENUM('general', 'academic', 'event', 'placement', 'urgent') DEFAULT 'general',
    target_role ENUM('all', 'student', 'faculty', 'admin') DEFAULT 'all',
    is_active BOOLEAN DEFAULT TRUE,

    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,

    FOREIGN KEY (created_by) REFERENCES users(id)
);

/* =====================================================
   7. NOTIFICATIONS
===================================================== */
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,

    title VARCHAR(255) NOT NULL,
    message TEXT,
    type ENUM('complaint', 'notice', 'event', 'placement', 'system') NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    related_id INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

/* =====================================================
   8. HELPDESK MODULE
===================================================== */
CREATE TABLE IF NOT EXISTS helpdesk_tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_custom_id VARCHAR(20) UNIQUE NOT NULL,
    user_id INT NOT NULL,

    category VARCHAR(100) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
    status ENUM('Open', 'In Progress', 'Resolved') DEFAULT 'Open',

    assigned_to VARCHAR(100) DEFAULT 'Pending Assignment',
    department VARCHAR(100) DEFAULT 'Helpdesk',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS helpdesk_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id INT NOT NULL,

    sender_role ENUM('student', 'faculty') NOT NULL,
    sender_name VARCHAR(255),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (ticket_id) REFERENCES helpdesk_tickets(id) ON DELETE CASCADE
);

/* =====================================================
   9. LOST & FOUND
===================================================== */
CREATE TABLE IF NOT EXISTS lost_found_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,

    type ENUM('Lost', 'Found') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,

    category VARCHAR(100) DEFAULT 'General',
    location VARCHAR(255) DEFAULT 'Campus',
    item_date DATE,

    status ENUM('Lost', 'Found', 'Claimed', 'Returned') DEFAULT 'Lost',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

/* =====================================================
   10. EVENTS
===================================================== */
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,

    event_type ENUM('Seminar', 'Fest', 'Holiday', 'Workshop', 'Other') DEFAULT 'Other',
    event_date DATETIME NOT NULL,

    location VARCHAR(255),
    organizer VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* =====================================================
   11. SAMPLE EVENT DATA
===================================================== */
INSERT INTO events (title, description, event_type, event_date, location, organizer)
VALUES
('Tech Innovation Summit', 'A workshop on AI and Future Tech.', 'Workshop', '2024-12-10 10:00:00', 'Room 101', 'CS Dept'),
('Annual Cultural Fest', 'A 3-day celebration of music and art.', 'Fest', '2025-02-15 18:00:00', 'Main Ground', 'Cultural Club');
