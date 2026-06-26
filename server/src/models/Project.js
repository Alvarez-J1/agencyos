const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    id: { type: Number, required: true },
    name: { type: String, required: true },
    client: { type: String, required: true },
    status: { type: String, enum: ['Planning', 'In Progress', 'Review', 'Completed'], default: 'Planning' },
    dueDate: { type: String, required: true },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

projectSchema.index({ owner: 1, id: 1 }, { unique: true });

module.exports = mongoose.model('Project', projectSchema);
