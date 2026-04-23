const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { createPayment, getPaymentHistory, getPlans } = require('../controllers/paymentController');

router.use(verifyToken);
router.get('/plans', getPlans);
router.post('/pay', createPayment);
router.get('/history', getPaymentHistory);

module.exports = router;