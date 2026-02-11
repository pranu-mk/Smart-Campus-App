const pollService = require('../services/pollService');

/**
 * Fetches all polls with detailed vote counts for the admin dashboard.
 */
exports.getAdminPolls = async (req, res) => {
    try {
        const polls = await pollService.getAllPollsAdmin();
        res.status(200).json(polls);
    } catch (error) {
        console.error("Admin Fetch Polls Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to load polls." });
    }
};

/**
 * Creates a new poll and its associated options.
 */
exports.createPoll = async (req, res) => {
    try {
        const { title, description, category, deadline, options } = req.body;
        
        if (!options || options.length < 2) {
            return res.status(400).json({ success: false, message: "At least 2 options are required." });
        }

        const pollId = await pollService.createFullPoll({
            title, description, category, deadline, options
        });

        res.status(201).json({ success: true, pollId, message: "Poll published successfully." });
    } catch (error) {
        console.error("Admin Create Poll Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to create poll." });
    }
};

/**
 * Closes an active poll to stop further voting.
 */
exports.closePoll = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pollService.updatePollStatus(id, 'closed');
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Poll not found." });
        }

        res.status(200).json({ success: true, message: "Poll closed. Results are now read-only." });
    } catch (error) {
        console.error("Admin Close Poll Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to close poll." });
    }
};
/**
 * Deletes a poll permanently.
 */
exports.deletePoll = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pollService.deletePoll(id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Poll not found or already deleted." });
        }

        res.status(200).json({ success: true, message: "Poll and all related data deleted." });
    } catch (error) {
        console.error("Admin Delete Poll Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to delete poll." });
    }
};