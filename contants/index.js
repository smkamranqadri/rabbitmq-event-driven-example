const EXCHANGE_OPTIONS = { durable: true }; // durable makes the queue itself survives restarts.
const EXCHANGE_TYPE = 'fanout'; // TODO: what is exchange type and what are the option and what they do
const EXCHANGE_NAME = 'user_events'; // TODO: what should be the exchange name, we can create multiple

const ROUTING_KEY_REGISTER = 'user.register'; // TODO: what should be the routing key, this can be optional when attaching to queue and multiple queue can have same key
const ROUTING_KEY_LOGIN = 'user.login';

const QUEUE_OPTIONS = { exclusive: false, durable: true }; // TODO: what does exclusive mean
const QUEUE_USER_EMAIL = 'user_email_queue';
const QUEUE_USER_ACTIVATION = 'user_activation_queue';
const QUEUE_USER_ACTIVITY = 'user_activity_queue';

const EVENT_USER_REGISTER = 'user_register'; // TODO: why do we need event name when we have many option listed above
const EVENT_USER_LOGIN = 'user_login';

module.exports = {
  EXCHANGE_OPTIONS,
  EXCHANGE_TYPE,
  EXCHANGE_NAME,
  ROUTING_KEY_REGISTER,
  ROUTING_KEY_LOGIN,
  QUEUE_OPTIONS,
  QUEUE_USER_EMAIL,
  QUEUE_USER_ACTIVATION,
  QUEUE_USER_ACTIVITY,
  EVENT_USER_REGISTER,
  EVENT_USER_LOGIN,
};
