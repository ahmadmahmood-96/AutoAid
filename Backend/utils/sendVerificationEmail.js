const nodemailer = require("nodemailer");

exports.sendVerificationEmail = async (email, otp) => {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSKEY
        }
    });

    // Setup email data with unicode symbols
    let mailOptions = {
        from: 'AutoAid', // Sender address
        to: email,
        subject: 'OTP Verification', // Subject line
        text: `Your OTP is: ${otp}`, // Plain text body
        html: `<b>Your OTP is: ${otp}</b>` // HTML body
    };

    try {
        // Send mail with defined transport object
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error in sending email:', error);
    }
};