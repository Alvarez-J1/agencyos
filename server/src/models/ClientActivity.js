const mongoose = require('mongoose');

const clientActivitySchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    clientId: { type: Number, required: true, index: true },
    title: { type: String, required: true },
    note: { type: String, required: true }
  },
  { timestamps: true }
);

clientActivitySchema.index({ owner: 1, clientId: 1, createdAt: -1 });

module.exports = mongoose.model('ClientActivity', clientActivitySchema);
