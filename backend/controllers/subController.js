const db = require('../config/db');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// A reusable description of your platform
const platformDescription = `
    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid #e0e0e0;">
        <h3 style="color: #2563eb;">What is SmartCampus?</h3>
        <p style="color: #4b5563; line-height: 1.6;">
            SmartCampus is your all-in-one digital gateway to campus life. Our platform leverages technology 
            to streamline student services, faculty management, and administrative updates. From real-time 
            notices and holiday announcements to academic resources, SmartCampus ensures you stay 
            connected to your institution wherever you are.
        </p>
    </div>
`;

exports.subscribe = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    try {
        await db.query('INSERT INTO email_subscribers (email) VALUES (?)', [email]);
        
        // Use the email as a unique identifier for the unsubscribe link
        const unsubscribeLink = `https://smart-campus-backend-app.onrender.com/api/subs/unsubscribe?email=${email}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to SmartCampus Updates!',
            html: `
                <h1>Welcome to the SmartCampus Community!</h1>
                ${platformDescription}
                <p>You will now receive the latest campus news, holiday alerts, and announcements directly in your inbox.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #9ca3af;">
                    Don't want these emails? 
                    <a href="${unsubscribeLink}" style="color: #ef4444;">Unsubscribe from SmartCampus</a>
                </p>
            `
        };
        await transporter.sendMail(mailOptions);
        res.status(201).json({ success: true, message: "Subscribed successfully!" });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: "Already subscribed!" });
        res.status(500).json({ message: "Server error", error });
    }
};

// --- NEW UNSUBSCRIBE LOGIC ---
exports.unsubscribe = async (req, res) => {
    const { email } = req.query; // Gets email from the link (?email=xyz)

    try {
        const [result] = await db.query(
            'UPDATE email_subscribers SET status = "unsubscribed" WHERE email = ?', 
            [email]
        );

        if (result.affectedRows === 0) {
            return res.send("<h1>Subscription not found.</h1>");
        }

        res.send(`
            <div style="text-align: center; margin-top: 50px; font-family: sans-serif;">
                <h1 style="color: #ef4444;">Unsubscribed Successfully</h1>
                <p>You will no longer receive updates from SmartCampus.</p>
                <a href="http://localhost:5173" style="color: #2563eb;">Return to Website</a>
            </div>
        `);
    } catch (error) {
        res.status(500).send("An error occurred during unsubscription.");
    }
};

exports.addUpdate = async (req, res) => {
    const { title, description, category } = req.body;
    try {
        await db.query('INSERT INTO campus_updates (title, description, category) VALUES (?, ?, ?)', [title, description, category]);

        const [subscribers] = await db.query('SELECT email FROM email_subscribers WHERE status = "active"');
        
        // Loop through each subscriber to give them their own unsubscribe link
        for (let sub of subscribers) {
            const unsubscribeLink = `https://smart-campus-backend-app.onrender.com/api/subs/unsubscribe?email=${sub.email}`;
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: sub.email,
                subject: `SmartCampus Update: ${title}`,
                html: `
                    <h2>${title}</h2>
                    <p><strong>Category:</strong> ${category.toUpperCase()}</p>
                    <p>${description}</p>
                    ${platformDescription}
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #9ca3af;">
                        Too many emails? <a href="${unsubscribeLink}" style="color: #ef4444;">Unsubscribe</a>
                    </p>
                `
            });
        }
        res.status(201).json({ success: true, message: "Update sent to all active subscribers!" });
    } catch (error) {
        res.status(500).json({ message: "Failed to post update", error });
    }
};