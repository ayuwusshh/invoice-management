// server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db/db');
const cors = require('cors');
const authRouter = require('./routes/authRouter');
const invoiceRouter = require('./routes/invoiceRouter');

// Load environment variables from .env file
dotenv.config();

// Connect to database
connectDB();

const app = express();

app.use(cors());

// Middleware
// Enable express to parse JSON body
app.use(express.json());

// Basic Route for testing
app.get('/', (req, res) => {
    res.send('Invoice Manager API is running... 🧾');
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/invoices', invoiceRouter);

// Error handling middleware (optional but recommended)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something broke!', error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}.`));