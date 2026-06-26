const mongoose = require('mongoose');

const Client = require('../models/Client');
const ClientActivity = require('../models/ClientActivity');

const getClientQuery = (idParam) => {
  const numericId = Number(idParam);

  if (!Number.isNaN(numericId)) {
    return { id: numericId };
  }

  if (mongoose.Types.ObjectId.isValid(idParam)) {
    return { _id: idParam };
  }

  return null;
};

const logClientActivity = async (clientId, title, note) => {
  try {
    await ClientActivity.create({ clientId, title, note });
  } catch (error) {
    console.warn('Client activity could not be recorded:', error.message);
  }
};

const buildClientUpdates = (body) => {
  const allowedUpdates = ['name', 'company', 'email', 'status', 'activeProjects', 'lastContact'];
  const updates = {};

  allowedUpdates.forEach((field) => {
    if (body[field] !== undefined) {
      updates[field] = field === 'activeProjects' ? Number(body[field]) : body[field];
    }
  });

  return updates;
};

const createClient = async (req, res) => {
  try {
    const { name, company, email, status = 'Active', activeProjects = 0, lastContact } = req.body;

    if (!name || !company || !email) {
      return res.status(400).json({ message: 'Name, company, and email are required.' });
    }

    const latestClient = await Client.findOne().sort({ id: -1 }).lean();
    const nextId = latestClient ? latestClient.id + 1 : 1;

    const client = await Client.create({
      id: nextId,
      name,
      company,
      email,
      status,
      activeProjects,
      lastContact: lastContact || new Intl.DateTimeFormat('en', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(new Date())
    });

    void logClientActivity(client.id, 'Client created', `${client.name} was added to ${client.company}.`);

    return res.status(201).json(client);
  } catch (error) {
    return res.status(400).json({ message: 'Client could not be created.' });
  }
};

const getClients = async (_req, res) => {
  try {
    const databaseClients = await Client.find().sort({ name: 1 }).lean();
    return res.json(databaseClients);
  } catch (error) {
    return res.status(500).json({ message: 'Clients could not be loaded.' });
  }
};

const getClientById = async (req, res) => {
  const query = getClientQuery(req.params.id);

  if (!query) {
    return res.status(400).json({ message: 'Client id is invalid.' });
  }

  try {
    const databaseClient = await Client.findOne(query).lean();

    if (databaseClient) {
      return res.json(databaseClient);
    }
  } catch (error) {
    return res.status(500).json({ message: 'Client could not be loaded.' });
  }

  return res.status(404).json({ message: 'Client not found' });
};

const updateClient = async (req, res) => {
  try {
    const query = getClientQuery(req.params.id);
    const updates = buildClientUpdates(req.body);

    if (!query) {
      return res.status(400).json({ message: 'Client id is invalid.' });
    }

    if (Number.isNaN(updates.activeProjects)) {
      return res.status(400).json({ message: 'Active projects must be a number.' });
    }

    const client = await Client.findOneAndUpdate(query, updates, {
      new: true,
      runValidators: true
    }).lean();

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    void logClientActivity(client.id, 'Client updated', `${client.name}'s account details were updated.`);

    return res.json(client);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Client could not be updated.' });
  }
};

const deleteClient = async (req, res) => {
  try {
    const query = getClientQuery(req.params.id);

    if (!query) {
      return res.status(400).json({ message: 'Client id is invalid.' });
    }

    const client = await Client.findOneAndDelete(query).lean();

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    await ClientActivity.deleteMany({ clientId: client.id });

    return res.json({ message: 'Client deleted.' });
  } catch (error) {
    return res.status(400).json({ message: 'Client could not be deleted.' });
  }
};

module.exports = { createClient, deleteClient, getClientById, getClients, updateClient };
