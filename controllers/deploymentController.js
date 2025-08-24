const pusherService = require('../services/pusherService');

exports.streamDeployment = (req, res) => {
    const deploymentId = req.params.id;
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const sendEvent = (data) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    pusherService.subscribeToChannel(`deployment-${deploymentId}`, sendEvent);

    req.on('close', () => {
        // Clean up when the connection is closed
    });
};
