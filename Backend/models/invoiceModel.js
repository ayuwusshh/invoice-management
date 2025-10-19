const mongoose = require('mongoose');

const lineItemSchema = new mongoose.Schema({
    description: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    rate: { type: Number, required: true, default: 0 },
    amount: { type: Number, required: true, default: 0 },
});

const invoiceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    customerName: {
        type: String,
        required: true,
        trim: true,
    },
    invoiceNumber: {
        type: String,
        unique: true,
    },
    issueDate: {
        type: Date,
        default: Date.now,
    },
    items: [lineItemSchema],
    totalAmount: {
        type: Number,
        required: true,
        default: 0,
    },
    status: {
        type: String,
        enum: ['Pending', 'Paid', 'Cancelled', 'Overdue'],
        default: 'Pending',
    },
}, {
    timestamps: true
});

const Invoice = mongoose.model('Invoice', invoiceSchema);
module.exports = Invoice;