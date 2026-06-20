const Task = require('../models/Task');
const { tasks } = require('../data/mockData');

const getTasks = async (_req, res) => {
  try {
    const databaseTasks = await Task.find().sort({ dueDate: 1 }).lean();
    res.json(databaseTasks.length > 0 ? databaseTasks : tasks);
  } catch (_error) {
    res.json(tasks);
  }
};

module.exports = { getTasks };
