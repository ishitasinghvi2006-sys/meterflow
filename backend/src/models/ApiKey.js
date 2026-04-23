const mongoose = require('mongoose');
const crypto = require('crypto');

const apiKeySchema = new mongoose.Schema({
  apiId: { type: mongoose.Schema.Types.ObjectId, ref: 'Api', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  key: { type: String, unique: true },
  status: { type: String, enum: ['active', 'revoked'], default: 'active' },
  requestCount: { type: Number, default: 0 },
  plan: { type: String, enum: ['free', 'pro'], default: 'free' }
}, { timestamps: true });

apiKeySchema.pre('save', function(next) {
  if (!this.key) this.key = 'mk_' + crypto.randomBytes(32).toString('hex');
  next();
});

const ApiKey = mongoose.models.ApiKey || mongoose.model('ApiKey', apiKeySchema);
module.exports = ApiKey;