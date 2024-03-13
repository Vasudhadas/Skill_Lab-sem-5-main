// order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'delivered'], default: 'pending' },
  otp: String,
  invoiceId: { type: String, required: true },
  paymentDetails: { type: mongoose.Schema.Types.Mixed },
  // Add other fields as needed
});

module.exports = mongoose.model('Order', orderSchema);
