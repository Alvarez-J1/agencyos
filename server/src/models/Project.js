const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    client: { type: String, required: true },
    status: { type: String, enum: ['Planning', 'In Progress', 'Review', 'Completed'], default: 'Planning' },
    dueDate: { type: String, required: true },
    progress: { type: Number, min: 0, max: 100, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
