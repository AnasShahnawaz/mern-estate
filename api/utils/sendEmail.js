import nodemailer from "nodemailer";

export async function sendEmail(email, subject, message) {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: process.env.EMAIL_PORT,
            secure: Boolean(process.env.SECURE),
            auth: {
                user: process.env.USER,
                pass: process.env.PASS
            }
        });

        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            text: message
        });

        console.log("Email sent successfully");
    } catch (err) {
        console.log("Email not sent");
        console.log(err);
    }
}