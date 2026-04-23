const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { 
  createApi, getApis, deleteApi, 
  generateKey, getKeys, revokeKey, rotateKey 
} = require('../controllers/apiController');

router.use(verifyToken);

router.post('/', createApi);
router.get('/', getApis);
router.delete('/:id', deleteApi);
router.post('/:id/keys', generateKey);
router.get('/:id/keys', getKeys);
router.delete('/keys/:keyId', revokeKey);
router.post('/keys/:keyId/rotate', rotateKey);

module.exports = router;