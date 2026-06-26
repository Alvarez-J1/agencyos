const User = require('../models/User');

const buildSettingsResponse = (user) => ({
  profile: {
    name: user.name,
    email: user.email,
    role: user.role || 'Agency Owner'
  },
  company: {
    companyName: user.companyName || '',
    website: user.website || '',
    teamSize: user.teamSize || 'Solo freelancer'
  },
  notifications: {
    taskAssigned: user.notifications?.taskAssigned ?? true,
    weeklySummary: user.notifications?.weeklySummary ?? true,
    deadlineReminders: user.notifications?.deadlineReminders ?? false
  },
  security: {
    twoFactorAuthentication: 'Not enabled',
    lastPasswordUpdate: user.passwordUpdatedAt
      ? user.passwordUpdatedAt.toISOString()
      : user.createdAt?.toISOString() || 'Not available',
    activeSessions: 'Current session'
  }
});

const getSettings = async (req, res) => {
  return res.json(buildSettingsResponse(req.user));
};

const updateSettings = async (req, res) => {
  try {
    const { profile = {}, company = {}, notifications = {} } = req.body;
    const updates = {};

    if (profile.name !== undefined) {
      updates.name = profile.name;
    }

    if (profile.email !== undefined) {
      const existingUser = await User.findOne({ email: profile.email, _id: { $ne: req.user._id } });

      if (existingUser) {
        return res.status(409).json({ message: 'A user with this email already exists.' });
      }

      updates.email = profile.email;
    }

    if (profile.role !== undefined) {
      updates.role = profile.role;
    }

    if (company.companyName !== undefined) {
      updates.companyName = company.companyName;
    }

    if (company.website !== undefined) {
      updates.website = company.website;
    }

    if (company.teamSize !== undefined) {
      updates.teamSize = company.teamSize;
    }

    if (notifications.taskAssigned !== undefined) {
      updates['notifications.taskAssigned'] = notifications.taskAssigned;
    }

    if (notifications.weeklySummary !== undefined) {
      updates['notifications.weeklySummary'] = notifications.weeklySummary;
    }

    if (notifications.deadlineReminders !== undefined) {
      updates['notifications.deadlineReminders'] = notifications.deadlineReminders;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true
    }).select('-password');

    return res.json(buildSettingsResponse(user));
  } catch (error) {
    return res.status(400).json({ message: 'Settings could not be updated.' });
  }
};

module.exports = { getSettings, updateSettings };
