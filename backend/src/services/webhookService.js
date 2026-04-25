const Webhook = require('../models/Webhook');
const AuditLog = require('../models/AuditLog');

const triggerWebhook = async (userId, event, payload) => {
  try {
    const webhooks = await Webhook.find({ userId, event, isActive: true });

    for (const webhook of webhooks) {
      try {
        const response = await fetch(webhook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-MeterFlow-Event': event
          },
          body: JSON.stringify({
            event,
            payload,
            timestamp: new Date().toISOString()
          }),
          signal: AbortSignal.timeout(5000) // 5 second timeout
        });

        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        webhook.lastTriggeredAt = new Date();
        webhook.failureCount = 0;
        await webhook.save();

        await AuditLog.create({
          userId,
          action: 'webhook_triggered',
          metadata: { event, url: webhook.url, payload }
        });

      } catch (err) {
        webhook.failureCount += 1;
        if (webhook.failureCount >= 5) webhook.isActive = false;
        await webhook.save();
        console.error(`Webhook failed for ${webhook.url}:`, err.message);
      }
    }
  } catch (err) {
    console.error('triggerWebhook error:', err.message);
  }
};

module.exports = { triggerWebhook };