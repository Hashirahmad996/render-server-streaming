const Pusher = require('pusher');

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_APP_CLUSTER,
  useTLS: true,
});

/**
 * A helper function to trigger a Pusher event and wrap the callback-based
 * API in a Promise, ensuring we can reliably `await` it.
 * @param {string} channel The channel to trigger on.
 * @param {string} event The name of the event.
 * @param {any} data The data to send.
 * @returns {Promise<any>} A promise that resolves with the response or rejects with an error.
 */
const triggerEvent = (channel, event, data) => {
  return new Promise((resolve, reject) => {
    pusher.trigger(channel, event, data, (error, request, response) => {
      if (error) {
        console.error("Pusher trigger error:", error);
        // Don't reject the promise here for log events,
        // as the primary flow shouldn't stop if a log fails to send.
        // But for critical events, you might want to reject.
        // For now, we'll log and resolve.
        return resolve(); // Or reject(error) if you want failures to stop the process
      }
      resolve(response);
    });
  });
};


/**
 * Call this function multiple times during your deployment 
 * to send real-time log messages to the frontend.
 */
exports.sendLogUpdate = async (logMessage) => {
  await triggerEvent('my-channel', 'log-update', { message: logMessage });
};

/**
 * Call this function if the deployment fails at any point.
 */
exports.sendError = async (errorMessage) => {
  await triggerEvent('my-channel', 'deployment-error', { message: errorMessage });
};

/**
 * Call this function only once at the very end when the 
 * deployment has completed successfully.
 */
exports.sendStatusUpdate = async (data) => {
  await triggerEvent('my-channel', 'deployment-success', data);
};
