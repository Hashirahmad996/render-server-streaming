const express = require('express');
const router = express.Router();
const deploymentController = require('../controllers/deploymentController');

router.get('/deployments/:id/stream', deploymentController.streamDeployment);

module.exports = router;
