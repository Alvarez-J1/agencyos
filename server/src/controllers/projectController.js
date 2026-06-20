const Project = require('../models/Project');
const { projects } = require('../data/mockData');

const getProjects = async (_req, res) => {
  try {
    const databaseProjects = await Project.find().sort({ dueDate: 1 }).lean();
    res.json(databaseProjects.length > 0 ? databaseProjects : projects);
  } catch (_error) {
    res.json(projects);
  }
};

module.exports = { getProjects };
