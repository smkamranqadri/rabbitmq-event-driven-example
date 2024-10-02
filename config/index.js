const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const PORT = process.env.PORT || 3000;

module.exports = {
  RABBITMQ_URL,
  PORT,
};
