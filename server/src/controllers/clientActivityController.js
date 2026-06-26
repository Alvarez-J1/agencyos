const ClientActivity = require('../models/ClientActivity');

const getClientActivity = async (req, res) => {
  try {
    const clientId = Number(req.params.id);

    if (Number.isNaN(clientId)) {
      return res.json([]);
    }

    const activity = await ClientActivity.find({ clientId }).sort({ createdAt: -1 }).lean();

    return res.json(activity);
  } catch (error) {
    return res.status(500).json({ message: 'Client activity could not be loaded.' });
  }
};

module.exports = { getClientActivity };
