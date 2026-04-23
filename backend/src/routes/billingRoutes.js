const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { getCurrentBill, getBillingHistory } = require('../controllers/billingController');

router.use(verifyToken);
router.get('/current', getCurrentBill);
router.get('/history', getBillingHistory);

module.exports = router;