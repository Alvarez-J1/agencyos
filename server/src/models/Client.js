const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    id: { type: Number, required: true },
    name: { type: String, required: true },
    company: { type: String, required: true },
    email: { type: String, required: true },
    status: { type: String, enum: ['Active', 'Onboarding', 'Paused'], default: 'Active' },
    activeProjects: { type: Number, default: 0 },
    lastContact: { type: String, required: true }
  },
  { timestamps: true }
);

clientSchema.index({ owner: 1, id: 1 }, { unique: true });

module.exports = mongoose.model('Client', clientSchema);
