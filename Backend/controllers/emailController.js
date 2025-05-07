const nodemailer = require('nodemailer');
require('dotenv').config(); // Make sure this is at the top of your file or entry point

exports.sendSaleEmail = async (req, res) => {
    const { customerEmail, customerName, finalAmount, items } = req.body;

    console.log("📧 Sending sale email to:", customerEmail);

    if (!customerEmail || !customerName || !finalAmount || !items) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const itemList = items.map(item =>
        `- ${item.ProductName} (x${item.Quantity}) @ ${item.PricePerUnit}`
    ).join('\n');

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: customerEmail,
        subject: '🛒 Thank You for Your Purchase at StockSync!',
        text: `Dear ${customerName},\n\nPlease find attached the sales invoice for your recent purchase with StockSync: \n\n${itemList}\n\nTotal Paid: PKR ${finalAmount}\n\nWe truly appreciate your business and look forward to serve you again.\n\nRegards,\nStockSync Team`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully to", customerEmail);
        res.status(200).json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error("❌ Failed to send email:", error);
        res.status(500).json({ success: false, message: 'Failed to send email', error: error.message });
    }
};
