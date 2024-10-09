import 'dotenv/config';

import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
const app = express();

// Middleware
app.use(cors());  // Allows cross-origin requests from your frontend
app.use(express.json());  // Parses JSON data from incoming requests

// Transporter setup with environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Endpoint to handle email sending
app.post('/send', (req, res) => {
  const { email, userName, message } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER, // Use your own email to avoid issues with Gmail
    to: process.env.EMAIL_USER, // Recipient (your email)
    replyTo: email, // User's email for replies
    subject: `New Portfolio Contact Submission from ${userName}`,
    text: `Name: ${userName}\nEmail: ${email}\nMessage: ${message}`,
  };
  

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to send email' });
    }
    res.status(200).json({ message: 'Email sent successfully' });
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});