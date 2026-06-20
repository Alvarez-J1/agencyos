const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    project: { type: String, required: true },
    assignee: { type: String, required: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    status: { type: String, enum: ['Todo', 'In Progress', 'Completed'], default: 'Todo' },
    dueDate: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
