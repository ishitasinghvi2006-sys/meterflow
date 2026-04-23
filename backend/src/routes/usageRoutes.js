const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { getLogs, getStats } = require('../controllers/usageController');

router.use(verifyToken);
router.get('/logs', getLogs);
router.get('/stats', getStats);

module.exports = router;