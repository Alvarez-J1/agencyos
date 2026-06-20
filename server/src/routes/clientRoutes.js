const express = require('express');

const { getClientById, getClients } = require('../controllers/clientController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getClients);
router.get('/:id', getClientById);

module.exports = router;
