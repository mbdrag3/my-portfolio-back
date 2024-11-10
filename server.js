import 'dotenv/config';
import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';

const app = express();

//redeploy

const allowedOrigins = [
  'https://michael-drag-portfolio.vercel.app',
  'https://michael-drag-portfolio-2kxylzhew-mbdrag3s-projects.vercel.app',
  'https://michael-drag-portfolio-mbdrag3s-projects.vercel.app',
  // Add any other URLs that you encounter
];

// Middleware to check allowed origins
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
};

// Apply CORS middleware
app.use(cors(corsOptions));
app.use(express.json()); // Parse JSON data from incoming requests


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
  const { email, fullName, message } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER, // Your email address
    to: process.env.EMAIL_USER,    // Receiving email address
    replyTo: email,                // User's email for replies
    subject: `New Portfolio Contact Submission from ${fullName}`,
    text: `Name: ${fullName}\nEmail: ${email}\nMessage: ${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
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
