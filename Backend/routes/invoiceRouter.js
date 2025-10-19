const express = require('express');
const { createInvoice, getUserInvoices, getInvoiceById } = require('../controllers/invoiceController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(protect, getUserInvoices)
    .post(protect, createInvoice);

router.route('/:id').get(protect, getInvoiceById);

module.exports = router;