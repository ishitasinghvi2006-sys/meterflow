const mongoose = require('mongoose');

const webhookSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  url: { type: String, required: true },
  event: {
    type: String,
    enum: ['limit_reached', 'payment_due', 'key_created', 'key_revoked'],
    required: true
  },
  isActive: { type: Boolean, default: true },
  secret: { type: String },
  lastTriggeredAt: { type: Date },
  failureCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Webhook', webhookSchema);