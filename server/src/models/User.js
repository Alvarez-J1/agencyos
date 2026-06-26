const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8 },
    passwordUpdatedAt: { type: Date, default: Date.now },
    role: { type: String, default: 'Agency Owner' },
    companyName: { type: String, default: '' },
    website: { type: String, default: '' },
    teamSize: { type: String, enum: ['Solo freelancer', '2-5 people', '6-15 people'], default: 'Solo freelancer' },
    notifications: {
      taskAssigned: { type: Boolean, default: true },
      weeklySummary: { type: Boolean, default: true },
      deadlineReminders: { type: Boolean, default: false }
    }
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.passwordUpdatedAt = new Date();
  return next();
});

userSchema.methods.matchPassword = function matchPassword(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
