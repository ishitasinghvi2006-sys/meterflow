const mongoose = require('mongoose');

const apiSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  baseUrl: { type: String, required: true, trim: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Api = mongoose.models.Api || mongoose.model('Api', apiSchema);
module.exports = Api;