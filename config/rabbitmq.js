const amqp = require('amqplib');

const { RABBITMQ_URL } = require('../config');
const {
  EXCHANGE_OPTIONS,
  EXCHANGE_TYPE,
  EXCHANGE_NAME,
} = require('../contants');

let channel, connection;

async function initRabbitMQ(connected, retries = 5) {
  try {
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();

    // TODO: may be this needs to be move since we can have many exchange
    // Declare exchange
    await channel.assertExchange(
      EXCHANGE_NAME,
      EXCHANGE_TYPE,
      EXCHANGE_OPTIONS
    );

    connected(channel, connection);
  } catch (error) {
    console.error('Error connecting to RabbitMQ', error);
    if (retries > 0) {
      console.log(`Retrying RabbitMQ connection (${retries} retries left)...`);
      setTimeout(() => initRabbitMQ(connected, retries - 1), 5000); // Retry after 5 seconds
    } else {
      console.error('Failed to connect to RabbitMQ after several retries.');
      process.exit(1); // Exit the app if RabbitMQ is not available
    }
  }
}

module.exports = { initRabbitMQ };
