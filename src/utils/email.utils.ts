const nodemailer = require('nodemailer');
 
// const Email = 'founders@wonderconnect.in'
// const Password = 'wonder@connect_kunal&anuj'
 
 
const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        // Create a transporter
        const transporter = nodemailer.createTransport({
            host: 'smtpout.secureserver.net', // GoDaddy SMTP server
            port: 465, // SSL port
            secure: true, // Use SSL
            auth: {
                user: process.env.Email,
                pass: process.env.Password
            },
        });
 
        const mailOptions = {
            from: 'tech@wanderconnect.in', // Sender address
            to: to, // List of recipients
            subject: subject,
            html: html,
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
 
export default sendEmail;
