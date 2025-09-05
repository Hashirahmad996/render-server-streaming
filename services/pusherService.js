const Pusher = require('pusher');

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_APP_CLUSTER,
  useTLS: true,
});

// --- Robust Pusher Service with Sequential Execution ---

// Queue to hold pending Pusher events. Each item will be an object
// with { channel, event, data, resolve, reject }.
const eventQueue = [];

// Flag to ensure that we only process one event at a time.
let isProcessing = false;

/**
 * Processes the event queue sequentially. This function is called recursively
 * until the queue is empty.
 */
const processQueue = async () => {
  if (eventQueue.length === 0) {
    isProcessing = false;
    return;
  }

  isProcessing = true;
  const { channel, event, data, resolve, reject } = eventQueue.shift();

  try {
    const response = await new Promise((res, rej) => {
      pusher.trigger(channel, event, data, (error, request, response) => {
        if (error) {
          console.error("Pusher trigger error:", error);
          // For log events, we resolve even on error to not stop the primary flow.
          // For critical events, this could be changed to rej(error).
          return res();
        }
        res(response);
      });
    });
    resolve(response);
  } catch (error) {
    // This will be caught if the inner promise is rejected.
    reject(error);
  }

  // Process the next item in the queue
  processQueue();
};

/**
 * A robust helper function to trigger a Pusher event. It adds the event to a
 * queue and ensures that events are processed one by one, in the order they
 * were received.
 * @param {string} channel The channel to trigger on.
 * @param {string} event The name of the event.
 * @param {any} data The data to send.
 * @returns {Promise<any>} A promise that resolves when the event is sent.
 */
const triggerEvent = (channel, event, data) => {
  return new Promise((resolve, reject) => {
    eventQueue.push({ channel, event, data, resolve, reject });
    if (!isProcessing) {
      processQueue();
    }
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
