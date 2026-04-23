const axios = require('axios');
const ApiKey = require('../models/ApiKey');
const UsageLog = require('../models/UsageLog');

const gatewayMiddleware = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey)
    return res.status(401).json({ message: 'API key required. Add X-API-Key header' });

  // Find and validate key
  const keyDoc = await ApiKey.findOne({ key: apiKey, status: 'active' }).populate('apiId');

  if (!keyDoc)
    return res.status(401).json({ message: 'Invalid or revoked API key' });

  if (!keyDoc.apiId)
    return res.status(404).json({ message: 'API not found' });

  const start = Date.now();
  const targetUrl = keyDoc.apiId.baseUrl + (req.query.path || '');

  try {
    // Forward request to actual API
    const response = await axios({
      method: req.method,
      url: targetUrl,
      headers: { 'Content-Type': 'application/json' },
      data: req.body
    });

    const latency = Date.now() - start;

    // Log usage asynchronously
    UsageLog.create({
      apiKeyId: keyDoc._id,
      userId: keyDoc.userId,
      endpoint: targetUrl,
      method: req.method,
      status: response.status,
      latency,
      ip: req.ip
    }).catch(err => console.error('Log error:', err));

    // Update request count
    ApiKey.findByIdAndUpdate(keyDoc._id, { $inc: { requestCount: 1 } }).catch(() => {});

    // Return response
    res.status(response.status).json(response.data);

  } catch (err) {
    const latency = Date.now() - start;
    const status = err.response?.status || 500;

    UsageLog.create({
      apiKeyId: keyDoc._id,
      userId: keyDoc.userId,
      endpoint: targetUrl,
      method: req.method,
      status,
      latency,
      ip: req.ip
    }).catch(() => {});

    res.status(status).json(err.response?.data || { message: 'Gateway error' });
  }
};

module.exports = gatewayMiddleware;