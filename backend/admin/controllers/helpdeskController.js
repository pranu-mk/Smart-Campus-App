const helpdeskService = require('../services/helpdeskService');

/**
 * Fetches unified helpdesk data including summary stats and ticket list.
 * This function is exported as a named property to ensure it is defined 
 * when required by the router.
 */
exports.getHelpdeskData = async (req, res) => {
    try {
        const summary = await helpdeskService.getHelpdeskSummary();
        const tickets = await helpdeskService.getAllTickets();
        
        res.status(200).json({ 
            success: true, 
            summary, 
            tickets 
        });
    } catch (error) {
        console.error("Helpdesk Controller [Fetch] Error:", error.message);
        res.status(500).json({ 
            success: false, 
            message: "Failed to retrieve helpdesk data." 
        });
    }
};

/**
 * Handles ticket status updates and official admin replies.
 * Uses req.params.id to identify the target ticket.
 */
exports.updateTicketAction = async (req, res) => {
    try {
        const ticketId = req.params.id;
        const updateData = req.body;

        await helpdeskService.updateTicket(ticketId, updateData);
        
        res.status(200).json({ 
            success: true, 
            message: "Ticket updated and reply stored successfully." 
        });
    } catch (error) {
        console.error("Helpdesk Controller [Update] Error:", error.message);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Failed to update ticket action." 
        });
    }
};