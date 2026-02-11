const db = require('../../config/db');

class EventService {
    async getAllEvents() {
        // Dynamically counts student registrations from the join table
        // We use 'max_capacity as maxCapacity' to map the DB column to your frontend key
        const [rows] = await db.execute(`
            SELECT 
                e.id, 
                e.title, 
                e.description, 
                DATE_FORMAT(e.event_date, '%Y-%m-%d') as date, 
                TIME_FORMAT(e.event_time, '%H:%i') as time,
                e.location as venue, 
                e.status, 
                COUNT(r.student_id) as registrations,
                e.max_capacity as maxCapacity, 
                e.organizer, 
                e.event_type as category
            FROM events e
            LEFT JOIN event_registrations r ON e.id = r.event_id
            GROUP BY e.id
            ORDER BY e.event_date DESC
        `);
        return rows;
    }

    async createEvent(data) {
        const { title, description, date, time, venue, category, maxCapacity, organizer } = data;
        
        // Ensure we insert into 'max_capacity' to match standard DB naming
        const [result] = await db.execute(
            `INSERT INTO events (title, description, event_date, event_time, location, event_type, status, max_capacity, organizer) 
             VALUES (?, ?, ?, ?, ?, ?, 'Approved', ?, ?)`,
            [
                title, 
                description, 
                date, 
                time, 
                venue, 
                category || 'technical', 
                maxCapacity || 100,
                organizer || 'Admin'
            ]
        );
        return { id: result.insertId, ...data };
    }

    async updateEvent(id, data) {
        const { title, description, date, time, venue, status, maxCapacity } = data;
        
        // This query will now succeed because 'status' matches the updated DB ENUM
        const [result] = await db.execute(
            `UPDATE events SET 
                title = COALESCE(?, title),
                description = COALESCE(?, description),
                event_date = COALESCE(?, event_date),
                event_time = COALESCE(?, event_time),
                location = COALESCE(?, location),
                status = COALESCE(?, status),
                max_capacity = COALESCE(?, max_capacity)
             WHERE id = ?`,
            [title, description, date, time, venue, status, maxCapacity, id]
        );
        
        return result.affectedRows > 0;
    }


    async deleteEvent(id) {
        // Deletes the event. If 'ON DELETE CASCADE' is set in DB, registrations will auto-delete.
        return await db.execute("DELETE FROM events WHERE id = ?", [id]);
    }
}

module.exports = new EventService();