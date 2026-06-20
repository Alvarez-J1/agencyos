const express = require('express');

const { getTasks } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getTasks);

module.exports = router;
