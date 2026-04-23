const express = require('express');
const router = express.Router();
const gatewayMiddleware = require('../gateway/gatewayMiddleware');

/**
 * @swagger
 * /gateway/proxy:
 *   get:
 *     summary: Proxy request through MeterFlow Gateway
 *     tags: [Gateway]
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: path
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Proxied response
 */
router.all('/proxy', gatewayMiddleware);

module.exports = router;