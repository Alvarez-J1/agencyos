const Client = require('../models/Client');
const { clients } = require('../data/mockData');

const getClients = async (_req, res) => {
  try {
    const databaseClients = await Client.find().sort({ name: 1 }).lean();
    res.json(databaseClients.length > 0 ? databaseClients : clients);
  } catch (_error) {
    res.json(clients);
  }
};

const getClientById = async (req, res) => {
  const id = Number(req.params.id);

  try {
    const databaseClient = await Client.findOne({ id }).lean();

    if (databaseClient) {
      return res.json(databaseClient);
    }
  } catch (_error) {
    // Fall back to mock data below.
  }

  const mockClient = clients.find((client) => client.id === id);

  if (!mockClient) {
    return res.status(404).json({ message: 'Client not found' });
  }

  return res.json(mockClient);
};

module.exports = { getClientById, getClients };
