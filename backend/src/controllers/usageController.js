const UsageLog = require('../models/UsageLog');

const getLogs = async (req, res, next) => {
  try {
    const logs = await UsageLog.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ logs });
  } catch (err) { next(err); }
};

const getStats = async (req, res, next) => {
  try {
    const totalRequests = await UsageLog.countDocuments({ userId: req.user.userId });
    const avgLatency = await UsageLog.aggregate([
      { $match: { userId: req.user.userId } },
      { $group: { _id: null, avg: { $avg: '$latency' } } }
    ]);
    const errors = await UsageLog.countDocuments({ userId: req.user.userId, status: { $gte: 400 } });
    res.json({
      totalRequests,
      avgLatency: avgLatency[0]?.avg?.toFixed(2) || 0,
      errorCount: errors,
      errorRate: totalRequests ? ((errors / totalRequests) * 100).toFixed(2) + '%' : '0%'
    });
  } catch (err) { next(err); }
};

module.exports = { getLogs, getStats };