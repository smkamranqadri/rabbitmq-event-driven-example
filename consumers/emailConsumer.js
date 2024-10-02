const {
  EXCHANGE_NAME,
  ROUTING_KEY_REGISTER,
  QUEUE_OPTIONS,
  QUEUE_USER_EMAIL,
  EVENT_USER_REGISTER,
} = require('../contants');

async function startEmailConsumer(channel) {
  try {
    const q = await channel.assertQueue(QUEUE_USER_EMAIL, QUEUE_OPTIONS);

    channel.bindQueue(q.queue, EXCHANGE_NAME, ROUTING_KEY_REGISTER);

    console.log('Email Consumer waiting for messages...');

    channel.consume(
      q.queue,
      (msg) => {
        if (msg.content) {
          const event = JSON.parse(msg.content.toString());

          // TODO: Why do we need to check event type where event type is custom data, this info should be maintain by exchange or queue or routing key
          if (event.type === EVENT_USER_REGISTER) {
            // Simulate sending email
            console.log(
              `Email Sending user =>  email:${event.data.email} | id:${event.data.id})`
            );
            // Simulate async operation
            setTimeout(() => {
              console.log(
                `Email Sent user =>  email:${event.data.email} | id:${event.data.id})`
              );
              channel.ack(msg);
            }, 1000);
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
    console.error('Error in Email Consumer:', error);
  }
}

module.exports = { startEmailConsumer };
