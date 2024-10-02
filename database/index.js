const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data.json');

// Load database (read from file)
const loadDb = () => {
  if (!fs.existsSync(dbPath)) {
    return { users: [], activities: [] };
  }
  return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
};

// Save database (write to file)
const saveDb = (db) => {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
};

// Add a user
const addUser = (newUser) => {
  const db = loadDb();
  db.users.push(newUser);
  saveDb(db);
  return;
};

// Get a user
const getUser = (userId) => {
  const db = loadDb();
  return db.users.find((user) => user.id === userId);
};

// Get a user by email
const getUserByEmail = (email) => {
  const db = loadDb();
  return db.users.find((user) => user.email === email);
};

// Get all users
const getUsers = () => {
  const db = loadDb();
  return db.users;
};

// Activate a user
const activateUser = (userId) => {
  const db = loadDb();
  const user = db.users.find((user) => user.id === userId);
  user.active = true;
  saveDb(db);
  return;
};

// Add a new activity
const addActivity = (newActivity) => {
  const db = loadDb();
  db.activities.push(newActivity);
  saveDb(db);
  return;
};

// Get all activities by userId
const getActivitiesByUserId = (userId) => {
  const db = loadDb();
  return db.activities.filter((act) => act.userId === userId);
};

// Get all activities
const getActivities = () => {
  const db = loadDb();
  return db.activities;
};

module.exports = {
  addUser,
  getUser,
  getUserByEmail,
  getUsers,
  activateUser,
  addActivity,
  getActivitiesByUserId,
  getActivities,
};
