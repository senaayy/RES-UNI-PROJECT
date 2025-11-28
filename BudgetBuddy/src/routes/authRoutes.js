const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDB, saveDB, createId } = require('../utils/db');

const DEMO_EMAIL = process.env.DEMO_EMAIL || 'demo@example.com';
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || 'DemoPass123!';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ msg: 'All fields are required.' });
    }

    const db = getDB();
    const existing = db.users.find((user) => user.email === email);
    if (existing) {
      return res.status(400).json({ msg: 'Email already in use.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = {
      id: createId(),
      username,
      email,
      password: hashed,
      createdAt: new Date().toISOString()
    };

    db.users.push(user);
    saveDB(db);

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '12h'
    });

    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ msg: 'Registration failed', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
    const token = jwt.sign({ id: 'demo-user' }, process.env.JWT_SECRET, {
      expiresIn: '12h'
    });
    return res.json({
      token,
      user: { id: 'demo-user', username: 'Demo User', email: DEMO_EMAIL }
    });
  }

  const db = getDB();
  const user = db.users.find((item) => item.email === email);
  if (!user) {
    return res.status(400).json({ msg: 'Invalid credentials.' });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).json({ msg: 'Invalid credentials.' });
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '12h'
  });

  res.json({
    token,
    user: { id: user.id, username: user.username, email: user.email }
  });
});

module.exports = router;

