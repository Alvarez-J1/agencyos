const mongoose = require('mongoose');

const Project = require('../models/Project');

const getProjectQuery = (idParam, owner) => {
  const numericId = Number(idParam);

  if (!Number.isNaN(numericId)) {
    return { owner, id: numericId };
  }

  if (mongoose.Types.ObjectId.isValid(idParam)) {
    return { owner, _id: idParam };
  }

  return null;
};

const createProject = async (req, res) => {
  try {
    const { name, client, status = 'Planning', dueDate, notes = '' } = req.body;

    if (!name || !client || !dueDate) {
      return res.status(400).json({ message: 'Project name, client, and due date are required.' });
    }

    const latestProject = await Project.findOne({ owner: req.user._id }).sort({ id: -1 }).lean();
    const nextId = latestProject ? latestProject.id + 1 : 1;

    const project = await Project.create({
      owner: req.user._id,
      id: nextId,
      name,
      client,
      status,
      dueDate,
      progress: status === 'Completed' ? 100 : 0,
      notes
    });

    return res.status(201).json(project);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Project could not be created.' });
  }
};

const getProjects = async (req, res) => {
  try {
    const databaseProjects = await Project.find({ owner: req.user._id }).sort({ dueDate: 1 }).lean();
    return res.json(databaseProjects);
  } catch (error) {
    return res.status(500).json({ message: 'Projects could not be loaded.' });
  }
};

const getProjectById = async (req, res) => {
  const query = getProjectQuery(req.params.id, req.user._id);

  if (!query) {
    return res.status(400).json({ message: 'Project id is invalid.' });
  }

  try {
    const project = await Project.findOne(query).lean();

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    return res.json(project);
  } catch (error) {
    return res.status(500).json({ message: 'Project could not be loaded.' });
  }
};

const updateProject = async (req, res) => {
  const query = getProjectQuery(req.params.id, req.user._id);

  if (!query) {
    return res.status(400).json({ message: 'Project id is invalid.' });
  }

  try {
    const allowedUpdates = ['name', 'client', 'status', 'dueDate', 'progress', 'notes'];
    const updates = {};

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = field === 'progress' ? Number(req.body[field]) : req.body[field];
      }
    });

    if (Number.isNaN(updates.progress)) {
      return res.status(400).json({ message: 'Progress must be a number.' });
    }

    const project = await Project.findOneAndUpdate(query, updates, {
      new: true,
      runValidators: true
    }).lean();

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    return res.json(project);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Project could not be updated.' });
  }
};

const deleteProject = async (req, res) => {
  const query = getProjectQuery(req.params.id, req.user._id);

  if (!query) {
    return res.status(400).json({ message: 'Project id is invalid.' });
  }

  try {
    const project = await Project.findOneAndDelete(query).lean();

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    return res.json({ message: 'Project deleted.' });
  } catch (error) {
    return res.status(400).json({ message: 'Project could not be deleted.' });
  }
};

module.exports = { createProject, deleteProject, getProjectById, getProjects, updateProject };
