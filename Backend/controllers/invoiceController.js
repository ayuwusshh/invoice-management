// controllers/invoiceController.js
const Invoice = require('../models/invoiceModel');
const calculateTotal = (items) => {
    return items.reduce((sum, item) => {
        const quantity = Number(item.quantity) || 0;
        const rate = Number(item.rate) || 0;
        item.amount = quantity * rate;
        return sum + item.amount;
    }, 0);
};

const createInvoice = async (req, res) => {
    const { customerName, items, status } = req.body;
    const totalAmount = calculateTotal(items);

    try {
        const invoice = new Invoice({
            user: req.user._id,
            customerName,
            items,
            totalAmount,
            status: status || 'Pending',
            invoiceNumber: `INV-${Date.now()}`, 
        });

        const createdInvoice = await invoice.save();
        res.status(201).json(createdInvoice);
    } catch (error) {
        res.status(400).json({ message: 'Error creating invoice', error: error.message });
    }
};
const getUserInvoices = async (req, res) => {
    const invoices = await Invoice.find({ user: req.user._id }).sort({ issueDate: -1 });

    res.json(invoices);
};
const getInvoiceById = async (req, res) => {
    const invoice = await Invoice.findById(req.params.id);

    if (invoice && invoice.user.toString() === req.user._id.toString()) {
        res.json(invoice);
    } else if (invoice && invoice.user.toString() !== req.user._id.toString()) {
         res.status(403).json({ message: 'Not authorized to view this invoice' });
    } else {
        res.status(404).json({ message: 'Invoice not found' });
    }
};

module.exports = { createInvoice, getUserInvoices, getInvoiceById };