const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    company: { type: String, required: true },
    email: { type: String, required: true },
    status: { type: String, enum: ['Active', 'Onboarding', 'Paused'], default: 'Active' },
    activeProjects: { type: Number, default: 0 },
    lastContact: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Client', clientSchema);
