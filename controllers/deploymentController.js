const pusherService = require('../services/pusherService');

exports.triggerDeploymentStatus = async (req, res) => {
  try {
    const data = req.body; // example: { status, app_url, monitor_url }
    await pusherService.sendStatusUpdate(data);
    res.status(200).send('Pusher event triggered successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to trigger event: ' + error.message);
  }
};
