const db = require('../config/db');

// --- 1. CREATE NEW TICKET ---
exports.createTicket = async (req, res) => {
    try {
        const userId = req.user.id;
        const { category, subject, message, priority } = req.body;
        const senderName = req.user.full_name || "Student"; // Use the name from JWT

        // Generate a custom ID like TKT123456
        const ticketCustomId = `TKT${Date.now().toString().slice(-6)}`;

        // Insert the master Ticket record
        const [ticketResult] = await db.execute(
            `INSERT INTO helpdesk_tickets (ticket_custom_id, user_id, category, subject, priority) 
            VALUES (?, ?, ?, ?, ?)`,
            [ticketCustomId, userId, category, subject, priority]
        );

        const newTicketId = ticketResult.insertId;

        // Insert the initial message into the thread
        await db.execute(
            `INSERT INTO helpdesk_messages (ticket_id, sender_role, sender_name, message) 
            VALUES (?, 'student', ?, ?)`,
            [newTicketId, senderName, message]
        );

        res.status(201).json({
            success: true,
            message: "Ticket created successfully",
            ticketId: ticketCustomId
        });

    } catch (error) {
        console.error("Helpdesk Create Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// --- 2. GET ALL TICKETS FOR STUDENT ---
exports.getTickets = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch all tickets owned by this specific student
        const [tickets] = await db.execute(
            `SELECT * FROM helpdesk_tickets WHERE user_id = ? ORDER BY created_at DESC`,
            [userId]
        );

        if (tickets.length === 0) {
            return res.status(200).json({ success: true, tickets: [] });
        }

        // Fetch all messages for these specific tickets
        const ticketIds = tickets.map(t => t.id);
        const [messages] = await db.execute(
            `SELECT * FROM helpdesk_messages WHERE ticket_id IN (${ticketIds.join(',')}) ORDER BY created_at ASC`
        );

        // Group messages inside their respective tickets for the frontend
        const formattedTickets = tickets.map(ticket => {
            return {
                id: ticket.ticket_custom_id,
                db_id: ticket.id, // Numeric ID for internal message routing
                category: ticket.category,
                subject: ticket.subject,
                status: ticket.status,
                priority: ticket.priority,
                assignedTo: ticket.assigned_to,
                department: ticket.department,
                date: new Date(ticket.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                messages: messages
                    .filter(m => m.ticket_id === ticket.id)
                    .map(m => ({
                        sender: m.sender_role,
                        message: m.message,
                        time: new Date(m.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
                        senderName: m.sender_name
                    }))
            };
        });

        res.status(200).json({ success: true, tickets: formattedTickets });

    } catch (error) {
        console.error("Helpdesk Fetch Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// --- 3. ADD MESSAGE TO EXISTING TICKET (STUDENT REPLIES) ---
exports.addMessage = async (req, res) => {
    try {
        const { id } = req.params; // The numeric db_id from the frontend
        const { message } = req.body;
        const senderName = req.user.full_name || "Student";

        if (!message || message.trim() === "") {
            return res.status(400).json({ success: false, message: "Message content required" });
        }

        // Insert the student's reply into the unified messages table
        await db.execute(
            `INSERT INTO helpdesk_messages (ticket_id, sender_role, sender_name, message) 
            VALUES (?, 'student', ?, ?)`,
            [id, senderName, message]
        );

        // Reset status to 'In Progress' if student replies to a resolved ticket
        await db.execute(
            `UPDATE helpdesk_tickets SET status = 'In Progress' WHERE id = ? AND status != 'In Progress'`,
            [id]
        );

        res.status(200).json({
            success: true,
            message: "Reply sent successfully"
        });

    } catch (error) {
        console.error("Helpdesk Reply Error:", error);
        res.status(500).json({ success: false, message: "Failed to send reply" });
    }
};