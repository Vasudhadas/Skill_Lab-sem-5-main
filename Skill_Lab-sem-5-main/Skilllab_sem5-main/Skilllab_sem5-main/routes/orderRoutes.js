// orderRoutes.js
const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const authenticateUser = require('../authMiddleware');
const otpGenerator = require('otp-generator');

// Display orders based on user with their respective statuses
router.get('/user/:userId', authenticateUser, async (req, res) => {
  const userId = req.params.userId;

  try {
    const userOrders = await Order.find({ userId });
    res.status(200).json(userOrders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Send OTP to user's email for order verification upon delivery
router.post('/sendOTP/:orderId', authenticateUser, async (req, res) => {
  const orderId = req.params.orderId;

  try {
    // Generate OTP
    const otp = otpGenerator.generate(6, { digits: true, upperCase: false, specialChars: false });

    // Update order status and OTP
    const updatedOrder = await Order.findByIdAndUpdate(orderId, { status: 'delivered', otp }, { new: true });

    // Fetch user email
    const user = await User.findById(updatedOrder.userId);
    const email = user.email;

    // Send OTP through email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'user@gmail.com', 
        pass: 'user' 
      }
    });

    const mailOptions = {
      from: 'user@gmail.com',
      to: email,
      subject: 'Order Delivered OTP',
      text: `Your OTP for order delivery verification is: ${otp}`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
