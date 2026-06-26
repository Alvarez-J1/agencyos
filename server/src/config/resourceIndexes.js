const Client = require('../models/Client');
const ClientActivity = require('../models/ClientActivity');
const Project = require('../models/Project');
const Task = require('../models/Task');

const numericIdResources = [
  { label: 'clients', model: Client },
  { label: 'projects', model: Project },
  { label: 'tasks', model: Task }
];

const isStaleGlobalIdIndex = (index) => {
  const keys = Object.keys(index.key || {});
  return index.unique === true && keys.length === 1 && index.key.id === 1;
};

const dropStaleGlobalIdIndex = async ({ label, model }) => {
  const indexes = await model.collection.indexes();
  const staleIndex = indexes.find(isStaleGlobalIdIndex);

  if (!staleIndex) {
    return;
  }

  try {
    await model.collection.dropIndex(staleIndex.name);
    console.log(`Dropped stale global ${label} id index.`);
  } catch (error) {
    if (error.code !== 27 && error.codeName !== 'IndexNotFound') {
      throw error;
    }
  }
};

const ensureResourceIndexes = async () => {
  await Promise.all(numericIdResources.map(dropStaleGlobalIdIndex));

  await Promise.all([
    Client.createIndexes(),
    Project.createIndexes(),
    Task.createIndexes(),
    ClientActivity.createIndexes()
  ]);
};

module.exports = ensureResourceIndexes;
