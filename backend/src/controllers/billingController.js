const { calculateBilling } = require('../services/billingService');
const Billing = require('../models/Billing');

const getCurrentBill = async (req, res, next) => {
  try {
    const month = new Date().toISOString().slice(0, 7);
    const billing = await calculateBilling(req.user.userId, month);
    res.json({ billing });
  } catch (err) { next(err); }
};

const getBillingHistory = async (req, res, next) => {
  try {
    const history = await Billing.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json({ history });
  } catch (err) { next(err); }
};

module.exports = { getCurrentBill, getBillingHistory };