const UsageLog = require('../models/UsageLog');
const Billing = require('../models/Billing');

const calculateBilling = async (userId, month) => {
  const start = new Date(month + '-01');
  const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
  const totalRequests = await UsageLog.countDocuments({ userId, createdAt: { $gte: start, $lt: end } });
  const freeRequests = 1000;
  const billableRequests = Math.max(0, totalRequests - freeRequests);
  const amount = billableRequests * 0.005;
  const billing = await Billing.findOneAndUpdate(
    { userId, month },
    { totalRequests, billableRequests, amount },
    { upsert: true, new: true }
  );
  return billing;
};

module.exports = { calculateBilling };