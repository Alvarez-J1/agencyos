const mongoose = require('mongoose');
const Client = require('../models/Client');
const ClientActivity = require('../models/ClientActivity');

const getClientQuery = (idParam, owner) => {
  const numericId = Number(idParam);

  if (!Number.isNaN(numericId)) {
    return { owner, id: numericId };
  }

  if (mongoose.Types.ObjectId.isValid(idParam)) {
    return { owner, _id: idParam };
  }

  return null;
};

const getClientActivity = async (req, res) => {
  try {
    const query = getClientQuery(req.params.id, req.user._id);

    if (!query) {
      return res.status(400).json({ message: 'Client id is invalid.' });
    }

    const client = await Client.findOne(query).lean();

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    const activity = await ClientActivity.find({ owner: req.user._id, clientId: client.id })
      .sort({ createdAt: -1 })
      .lean();

    return res.json(activity);
  } catch (error) {
    return res.status(500).json({ message: 'Client activity could not be loaded.' });
  }
};

module.exports = { getClientActivity };
