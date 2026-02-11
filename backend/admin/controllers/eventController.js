const eventService = require('../services/eventService');

/**
 * Fetches all events for the admin management list.
 */
exports.getAllEvents = async (req, res) => {
    try {
        const events = await eventService.getAllEvents();
        res.status(200).json({ success: true, events });
    } catch (error) {
        console.error("Fetch Events Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to load events." });
    }
};

/**
 * Creates a new campus event.
 */
exports.createEvent = async (req, res) => {
    try {
        const eventData = req.body;
        const newEvent = await eventService.createEvent(eventData);
        res.status(201).json({ success: true, event: newEvent, message: "Event created successfully." });
    } catch (error) {
        console.error("Create Event Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to create event." });
    }
};

/**
 * Updates an existing event and syncs changes across dashboards.
 */
exports.updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const updated = await eventService.updateEvent(id, updateData);
        
        if (!updated) {
            return res.status(404).json({ success: false, message: "Event not found." });
        }

        res.status(200).json({ 
            success: true, 
            message: "Event updated successfully across all dashboards." 
        });
    } catch (error) {
        console.error("Update Event Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to update event." });
    }
};

/**
 * Deletes an event from the system.
 */
exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        await eventService.deleteEvent(id);
        res.status(200).json({ success: true, message: "Event deleted successfully." });
    } catch (error) {
        console.error("Delete Event Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to delete event." });
    }
};