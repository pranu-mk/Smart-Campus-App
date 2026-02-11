const twilio = require('twilio');

const client = new twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

exports.sendContactSMS = async (req, res) => {
    // Safety check to prevent the 'destructure' crash
    if (!req.body) {
        return res.status(400).json({ success: false, message: "No data received by server." });
    }

    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: "Required fields missing." });
    }

    const smsBody = `📩 Contact Form:\nName: ${name}\nEmail: ${email}\nSub: ${subject}\nMsg: ${message}`;

    try {
        await client.messages.create({
            body: smsBody,
            messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
            to: process.env.MY_MOBILE_NUMBER
        });

        res.status(200).json({ success: true, message: "SMS sent successfully!" });
    } catch (error) {
        console.error("Twilio Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};