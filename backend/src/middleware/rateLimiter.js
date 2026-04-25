const { triggerWebhook } = require('../services/webhookService');

const requestCounts = {};

const rateLimiter = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) return next();

  const now = Date.now();
  const windowMs = 60 * 1000;
  const limit = 100;

  if (!requestCounts[apiKey]) {
    requestCounts[apiKey] = { count: 1, startTime: now };
  } else {
    if (now - requestCounts[apiKey].startTime > windowMs) {
      requestCounts[apiKey] = { count: 1, startTime: now };
    } else {
      requestCounts[apiKey].count++;
    }
  }

  const count = requestCounts[apiKey].count;
  res.setHeader('X-RateLimit-Limit', limit);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, limit - count));

  if (count > limit) {
    // Trigger webhook when limit is hit
    try {
      const ApiKey = require('../models/ApiKey');
      const keyDoc = await ApiKey.findOne({ key: apiKey });
      if (keyDoc) {
        await triggerWebhook(keyDoc.userId, 'limit_reached', {
          endpoint: req.path,
          apiKey: apiKey,
          count
        });
      }
    } catch (err) {
      console.error('Webhook trigger error:', err.message);
    }

    return res.status(429).json({
      message: 'Rate limit exceeded. Try again in 1 minute.',
      retryAfter: 60
    });
  }

  next();
};

module.exports = rateLimiter;