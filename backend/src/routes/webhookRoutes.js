const express = require('express');
const router = express.Router();
const Webhook = require('../models/Webhook');
const AuditLog = require('../models/AuditLog');
const UsageLog = require('../models/UsageLog');
const authMiddleware = require('../middleware/authMiddleware');

// Register a webhook
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { url, event } = req.body;
    if (!url || !event) return res.status(400).json({ error: 'url and event are required' });

    const webhook = await Webhook.create({ userId: req.user.id, url, event });

    await AuditLog.create({
      userId: req.user.id,
      action: 'key_created',
      metadata: { type: 'webhook', webhookId: webhook._id, event, url },
      ipAddress: req.ip
    });

    res.status(201).json({ message: 'Webhook registered', webhook });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all webhooks for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const webhooks = await Webhook.find({ userId: req.user.id });
    res.json(webhooks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a webhook
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Webhook.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Webhook deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics/errors — error rate per endpoint per API key
router.get('/analytics/errors', authMiddleware, async (req, res) => {
  try {
    const errors = await UsageLog.aggregate([
      { $match: { userId: req.user._id, statusCode: { $gte: 400 } } },
      {
        $group: {
          _id: { endpoint: '$endpoint', apiKey: '$apiKey' },
          errorCount: { $sum: 1 },
          lastError: { $max: '$timestamp' }
        }
      },
      { $sort: { errorCount: -1 } },
      { $limit: 50 }
    ]);
    res.json(errors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics/latency — P50/P95/P99 per endpoint
router.get('/analytics/latency', authMiddleware, async (req, res) => {
  try {
    const latency = await UsageLog.aggregate([
      { $match: { userId: req.user._id, responseTime: { $exists: true } } },
      { $sort: { responseTime: 1 } },
      {
        $group: {
          _id: '$endpoint',
          latencies: { $push: '$responseTime' },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          endpoint: '$_id',
          count: 1,
          p50: { $arrayElemAt: ['$latencies', { $floor: { $multiply: [0.50, '$count'] } }] },
          p95: { $arrayElemAt: ['$latencies', { $floor: { $multiply: [0.95, '$count'] } }] },
          p99: { $arrayElemAt: ['$latencies', { $floor: { $multiply: [0.99, '$count'] } }] }
        }
      }
    ]);
    res.json(latency);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/audit-logs
router.get('/audit-logs', authMiddleware, async (req, res) => {
  try {
    const logs = await AuditLog.find({ userId: req.user.id })
      .sort({ timestamp: -1 })
      .limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
