const express = require('express');

const { getProjects } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getProjects);

module.exports = router;
