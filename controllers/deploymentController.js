const pusherService = require('../services/pusherService');

/**
 * Forwards a webhook event to the appropriate Pusher channels.
 */
exports.forwardPusherEvent = async (req, res) => {
  const { channels, name, data } = req.body;

  if (!channels || !name || !data) {
    return res.status(400).json({ error: 'Request body must include "channels", "name", and "data" fields.' });
  }

  if (!Array.isArray(channels)) {
    return res.status(400).json({ error: 'The "channels" field must be an array.' });
  }

  try {
    // Trigger the event on all specified channels
    const triggerPromises = channels.map(channel =>
      pusherService.triggerEvent(channel, name, data)
    );
    await Promise.all(triggerPromises);

    res.status(200).json({ message: 'Event forwarded successfully to Pusher.' });
  } catch (error) {
    console.error('Failed to forward event to Pusher:', error);
    res.status(500).json({ error: 'Internal server error while forwarding event.' });
  }
};
