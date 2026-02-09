const express = require('express');
const router = express.Router();

// In-memory waitlist (use DB in production)
const waitlist = [];

// Welcome
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to ClassPal API',
    version: '1.0.0',
    endpoints: {
      status: 'GET /api/status',
      waitlist: 'POST /api/waitlist',
    },
  });
});

// Status
router.get('/status', (req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Waitlist (early access / interest)
router.post('/waitlist', (req, res) => {
  const { email, name } = req.body || {};

  if (!email || !email.trim()) {
    return res.status(400).json({
      error: 'Email is required',
    });
  }

  const entry = {
    email: email.trim(),
    name: (name || '').trim(),
    timestamp: new Date().toISOString(),
  };
  waitlist.push(entry);

  console.log('Waitlist signup:', entry);

  res.json({
    success: true,
    message: "You're on the list. We'll be in touch.",
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
