const mongoose = require('mongoose');

const usageLogSchema = new mongoose.Schema({
  apiKeyId: { type: mongoose.Schema.Types.ObjectId, ref: 'ApiKey', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  endpoint: { type: String, required: true },
  method: { type: String, required: true },
  status: { type: Number, required: true },
  latency: { type: Number, required: true },
  ip: { type: String }
}, { timestamps: true });

usageLogSchema.index({ apiKeyId: 1, createdAt: -1 });

const UsageLog = mongoose.models.UsageLog || mongoose.model('UsageLog', usageLogSchema);
module.exports = UsageLog;