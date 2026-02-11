const db = require('../../config/db');

class AdminPollService {
    /**
     * Retrieves all polls and their nested options.
     */
    async getAllPollsAdmin() {
        const [polls] = await db.execute('SELECT * FROM polls ORDER BY created_at DESC');
        
        const detailedPolls = await Promise.all(polls.map(async (poll) => {
            const [options] = await db.execute(
                'SELECT id, option_text as text, votes_count as votes FROM poll_options WHERE poll_id = ?',
                [poll.id]
            );
            return { ...poll, options };
        }));
        
        return detailedPolls;
    }
async deletePoll(id) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // The 'ON DELETE CASCADE' in your schema handles poll_options and poll_votes
            const [result] = await connection.execute(
                "DELETE FROM polls WHERE id = ?",
                [id]
            );

            await connection.commit();
            return result;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
    /**
     * Transaction-safe poll creation.
     */
    async createFullPoll(data) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const [pollResult] = await connection.execute(
                "INSERT INTO polls (title, description, category, deadline, status) VALUES (?, ?, ?, ?, 'active')",
                [data.title, data.description, data.category, data.deadline]
            );

            const pollId = pollResult.insertId;

            for (const optionText of data.options) {
                if (optionText.trim()) {
                    await connection.execute(
                        "INSERT INTO poll_options (poll_id, option_text) VALUES (?, ?)",
                        [pollId, optionText]
                    );
                }
            }

            await connection.commit();
            return pollId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async updatePollStatus(id, status) {
        const [result] = await db.execute(
            "UPDATE polls SET status = ? WHERE id = ?",
            [status, id]
        );
        return result;
    }
}

module.exports = new AdminPollService();