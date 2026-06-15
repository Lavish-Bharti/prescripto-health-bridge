// // const express = require('express');
// // const cors = require('cors');
// // const dotenv = require('dotenv');
// // const connectDB = require('./config/db');

// // dotenv.config();
// // connectDB();

// // const app = express();

// // app.use(cors({
// //   origin: 'http://localhost:3000',
// //   credentials: true,
// // }));
// // app.use(express.json());
// // app.use(express.urlencoded({ extended: true }));

// // // Routes
// // app.use('/api/user',         require('./routes/userRoutes'));
// // app.use('/api/doctor',       require('./routes/doctorRoutes'));
// // app.use('/api/admin',        require('./routes/adminRoutes'));
// // app.use('/api/doctors',      require('./routes/doctorRoutes'));
// // app.use('/api/appointments', require('./routes/appointmentRoutes'));

// // // Health check
// // app.get('/', (req, res) => {
// //   res.json({ message: 'Prescripto API is running ✅' });
// // });

// // // Error handler
// // app.use((err, req, res, next) => {
// //   console.error(err.stack);
// //   res.status(500).json({ success: false, message: 'Server error' });
// // });

// // const PORT = process.env.PORT || 5000;
// // app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// const express     = require('express');
// const cors        = require('cors');
// const helmet      = require('helmet');
// const dotenv      = require('dotenv');
// const rateLimit   = require('express-rate-limit');
// const connectDB   = require('./config/db');
// const errorHandler= require('./middleware/errorHandler');

// dotenv.config();
// connectDB();

// const app = express();

// // ── Security Middleware ──
// app.use(helmet());
// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:3000',
//   credentials: true,
// }));

// // ── Rate Limiting ──
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100,
//   message: { success: false, message: 'Too many requests, please try again later.' },
// });
// app.use('/api/', limiter);

// // ── Special: Raw body for Razorpay webhooks ──
// app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

// // ── Body Parsers ──
// app.use(express.json({ limit: '10kb' }));
// app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// // ── Routes ──
// app.use('/api/payment', require('./routes/paymentRoutes'));

// // ── Health Check ──
// app.get('/', (req, res) => {
//   res.json({ success: true, message: '💳 Prescripto Payment API Running ✅' });
// });

// // ── 404 Handler ──
// app.use((req, res) => {
//   res.status(404).json({ success: false, message: 'Route not found' });
// });

// // ── Error Handler ──
// app.use(errorHandler);

// const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => console.log(`🚀 Payment Server running on port ${PORT}`));


const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();
const cors = require("cors");

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://prescripto-health-bridge.vercel.app",
      "https://prescripto-health-bridge-xlsf.vercel.app"
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/user',         require('./routes/userRoutes'));
app.use('/api/doctor',       require('./routes/doctorRoutes'));
app.use('/api/admin',        require('./routes/adminRoutes'));
app.use('/api/doctors',      require('./routes/doctorRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Prescripto API is running ✅' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));