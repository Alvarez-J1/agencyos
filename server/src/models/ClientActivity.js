const mongoose = require('mongoose');

const clientActivitySchema = new mongoose.Schema(
  {
    clientId: { type: Number, required: true, index: true },
    title: { type: String, required: true },
    note: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ClientActivity', clientActivitySchema);
