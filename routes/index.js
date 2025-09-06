const express = require('express');
const router = express.Router();
const deploymentController = require('../controllers/deploymentController');

router.post('/trigger-event', deploymentController.forwardPusherEvent);

module.exports = router;
