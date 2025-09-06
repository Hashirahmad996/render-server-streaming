const Pusher = require('pusher');

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_APP_CLUSTER,
  useTLS: true,
});

/**
 * Triggers an event on a specified Pusher channel.
 * @param {string} channel - The name of the channel.
 * @param {string} eventName - The name of the event.
 * @param {object} data - The payload to send with the event.
 */
exports.triggerEvent = async (channel, eventName, data) => {
  await pusher.trigger(channel, eventName, data);
};
