const express = require('express');

const { v4: uuidv4 } = require('uuid');

const { PORT } = require('../config');
const {
  EXCHANGE_NAME,
  ROUTING_KEY_REGISTER,
  ROUTING_KEY_LOGIN,
  EVENT_USER_REGISTER,
  EVENT_USER_LOGIN,
} = require('../contants');
const {
  getActivitiesByUserId,
  getUserByEmail,
  addUser,
} = require('../database');
const { initRabbitMQ } = require('../config/rabbitmq');

// Initialize Express app
const app = express();
app.use(express.json());

// Initialize RabbitMQ
let channel;
initRabbitMQ((_channel, connection) => {
  channel = _channel;
  console.log('Connected to RabbitMQ');
  console.log(`RabbitMQ Managment is available at http://localhost:15672`);
  process.on('SIGINT', async () => {
    console.log('Closing RabbitMQ connection...');
    await channel.close();
    await connection.close();
    process.exit(0);
  });
});

// API Endpoints

/**
 * Register a new user
 * POST /register
 * Body: { "email": "user@example.com" }
 */
app.post('/register', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  // Check if user already exists
  const existingUser = getUserByEmail(email);
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists.' });
  }

  const userId = uuidv4();
  const newUser = {
    id: userId,
    email,
    active: false,
  };
  addUser(newUser);
  console.log(`Registered user => email:${email} | id:${userId}`);

  try {
    // TODO: Move this into utility function to reuse the publishing code and keep it consistant
    // Publish event to RabbitMQ
    const event = {
      type: EVENT_USER_REGISTER,
      data: newUser,
    };

    channel.publish(
      EXCHANGE_NAME,
      ROUTING_KEY_REGISTER,
      Buffer.from(JSON.stringify(event)),
      { persistent: true } // make message to be save even server restarted or crashed
    );

    res
      .status(201)
      .json({ message: 'User registered successfully.', user: newUser });
  } catch (error) {
    console.error('Error adding jobs:', error);
    res.status(500).json({ error: 'Failed to process registration.' });
  }
});

/**
 * Login a user
 * POST /login
 * Body: { "email": "user@example.com" }
 */
app.post('/login', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  const user = getUserByEmail(email);
  if (!user) {
    return res.status(400).json({ error: 'User not found.' });
  }

  if (!user.active) {
    return res.status(403).json({ error: 'User is not activated.' });
  }
  console.log(`Loggedin user => email:${user.email} | id:${user.id}`);

  try {
    // TODO: Move this into utility function to reuse the publishing code and keep it consistant
    // Publish event to RabbitMQ
    const event = {
      type: EVENT_USER_LOGIN,
      data: { id: user.id, email: user.email },
    };

    channel.publish(
      EXCHANGE_NAME,
      ROUTING_KEY_LOGIN,
      Buffer.from(JSON.stringify(event)),
      { persistent: true } // make message to be save even server restarted or crashed
    );

    // Retrieve user activities
    const userActivities = getActivitiesByUserId(user.id);

    res.status(200).json({
      message: 'Login successful.',
      user: {
        id: user.id,
        email: user.email,
        active: user.active,
      },
      activities: userActivities,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Failed to process login.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
