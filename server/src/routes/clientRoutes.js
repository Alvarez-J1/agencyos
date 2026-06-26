const express = require('express');

const { createClient, deleteClient, getClientById, getClients, updateClient } = require('../controllers/clientController');
const { getClientActivity } = require('../controllers/clientActivityController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getClients);
router.post('/', createClient);
router.get('/:id/activity', getClientActivity);
router.get('/:id', getClientById);
router.patch('/:id', updateClient);
router.delete('/:id', deleteClient);

module.exports = router;
