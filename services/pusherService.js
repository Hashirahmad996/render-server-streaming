const Pusher = require('pusher');

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_APP_CLUSTER,
  useTLS: true,
});

/**
 * Call this function multiple times during your deployment 
 * to send real-time log messages to the frontend.
 */
exports.sendLogUpdate = async (logMessage) => { await pusher.trigger('my-channel', 'log-update', { message: logMessage }); };

/**
 * Call this function if the deployment fails at any point.
 */
exports.sendError = async (errorMessage) => { await pusher.trigger('my-channel', 'deployment-error', { message: errorMessage }); };

/**
 * Call this function only once at the very end when the 
 * deployment has completed successfully.
 */
exports.sendStatusUpdate = async (data) => { await pusher.trigger('my-channel', 'deployment-success', data); };
