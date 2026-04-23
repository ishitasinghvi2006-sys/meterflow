const Payment = require('../models/Payment');
const User = require('../models/User');
const crypto = require('crypto');

const createPayment = async (req, res, next) => {
  try {
    const { plan } = req.body;
    const amount = plan === 'pro' ? 999 : 0;
    const transactionId = 'TXN_' + crypto.randomBytes(8).toString('hex').toUpperCase();
    const month = new Date().toISOString().slice(0, 7);

    const payment = await Payment.create({
      userId: req.user.userId,
      amount,
      plan,
      transactionId,
      month,
      status: 'completed'
    });

    await User.findByIdAndUpdate(req.user.userId, { plan });

    res.json({
      message: 'Payment successful',
      transactionId,
      amount,
      plan,
      payment
    });
  } catch (err) { next(err); }
};

const getPaymentHistory = async (req, res, next) => {
  try {
    const payments = await Payment.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });
    res.json({ payments });
  } catch (err) { next(err); }
};

const getPlans = async (req, res, next) => {
  res.json({
    plans: [
      { name: 'free', price: 0, requests: 1000, description: 'Free tier - 1000 requests/month' },
      { name: 'pro', price: 999, requests: 'unlimited', description: 'Pro tier - unlimited requests' }
    ]
  });
};

module.exports = { createPayment, getPaymentHistory, getPlans };