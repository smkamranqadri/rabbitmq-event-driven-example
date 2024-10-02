const {
  EXCHANGE_NAME,
  ROUTING_KEY_REGISTER,
  QUEUE_OPTIONS,
  QUEUE_USER_ACTIVATION,
  EVENT_USER_REGISTER,
} = require('../contants');

const { getUser, activateUser } = require('../database');

async function startActivationConsumer(channel) {
  try {
    const q = await channel.assertQueue(QUEUE_USER_ACTIVATION, QUEUE_OPTIONS);

    channel.bindQueue(q.queue, EXCHANGE_NAME, ROUTING_KEY_REGISTER);

    console.log('Activation Consumer waiting for messages...');

    channel.consume(
      q.queue,
      (msg) => {
        if (msg.content) {
          const event = JSON.parse(msg.content.toString());

          // TODO: Why do we need to check event type where event type is custom data, this info should be maintain by exchange or queue or routing key
          if (event.type === EVENT_USER_REGISTER) {
            // Simulate activation process
            console.log(
              `Activating user => email:${event.data.email} | id:${event.data.id})`
            );
            // Simulate async operation
            setTimeout(async () => {
              const user = getUser(event.data.id);
              if (user) {
                activateUser(event.data.id);
                console.log(
                  `Activated user => email:${event.data.email} | id:${event.data.id})`
                );
                channel.ack(msg);
              } else {
                console.log(
                  `Activation failed, not found, user => email:${event.data.email} | id:${event.data.id})`
                );
                // Reject the message and requeue it
                // TODO: get understanding on what second and third param do
                channel.nack(msg, false, true);
              }
            }, 2000);
          } else {
            // Ignore other event types
            channel.ack(msg);
          }
        }
      },
      // automatic ack setting off
      { noAck: false }
    );
  } catch (error) {
    console.error('Error in Activation Consumer:', error);
  }
}

module.exports = { startActivationConsumer };
