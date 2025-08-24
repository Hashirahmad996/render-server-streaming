const express = require('express');
const router = express.Router();
const deploymentController = require('../controllers/deploymentController');

router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Render Server Streaming API' });
});

router.get('/deployments/:id/stream', deploymentController.streamDeployment);

module.exports = router;
