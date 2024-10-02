const { initRabbitMQ } = require('../config/rabbitmq');
const { startEmailConsumer } = require('./emailConsumer');
const { startActivationConsumer } = require('./activationConsumer');
const { startActivityConsumer } = require('./activityConsumer');

initRabbitMQ((channel, connection) => {
  console.log('Connected to RabbitMQ');
  console.log('Starting listening consumers!');

  startEmailConsumer(channel);
  startActivationConsumer(channel);
  startActivityConsumer(channel);

  process.on('SIGINT', async () => {
    console.log('Closing RabbitMQ connection...');
    await channel.close();
    await connection.close();
    process.exit(0);
  });
});
