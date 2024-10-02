const {
  EXCHANGE_NAME,
  QUEUE_OPTIONS,
  QUEUE_USER_ACTIVITY,
  EVENT_USER_REGISTER,
  EVENT_USER_LOGIN,
} = require('../contants');

const { addActivity } = require('../database');

async function startActivityConsumer(channel) {
  try {
    const q = await channel.assertQueue(QUEUE_USER_ACTIVITY, QUEUE_OPTIONS);

    channel.bindQueue(q.queue, EXCHANGE_NAME, '');

    console.log('Activity Consumer waiting for messages...');

    channel.consume(
      q.queue,
      (msg) => {
        if (msg.content) {
          const event = JSON.parse(msg.content.toString());

          // TODO: Why do we need to check event type where event type is custom data, this info should be maintain by exchange or queue or routing key
          if (
            event.type === EVENT_USER_REGISTER ||
            event.type === EVENT_USER_LOGIN
          ) {
            // Log activity
            console.log(
              `Activity logging user => email:${event.data.email} | id:${event.data.id} | ${event.type}`
            );
            // Simulate async operation
            setTimeout(async () => {
              await addActivity({
                userId: event.data.id,
                activity: event.type,
                timestamp: new Date(),
              });
              console.log(
                `Activity logged user => email:${event.data.email} | id:${event.data.id} | ${event.type}`
              );
              channel.ack(msg);
            }, 500);
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
    console.error('Error in Activity Consumer:', error);
  }
}

module.exports = { startActivityConsumer };
