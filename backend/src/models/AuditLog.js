const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: {
    type: String,
    enum: ['key_created', 'key_revoked', 'key_rotated', 'payment_processed', 'limit_reached', 'webhook_triggered', 'login', 'logout'],
    required: true
  },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  ipAddress: { type: String },
  userAgent: { type: String },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: false });

auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ action: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);