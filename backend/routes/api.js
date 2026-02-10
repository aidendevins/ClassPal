const express = require('express');
const router = express.Router();
const multer = require('multer');
const OpenAI = require('openai');
const fs = require('fs');

// In-memory waitlist (use DB in production)
const waitlist = [];

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// OpenAI client created only when API key is set (avoids crash on startup)
function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) return null;
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

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

// Transcribe audio using OpenAI Whisper
router.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    const openai = getOpenAI();
    if (!openai) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    // Use Whisper API to transcribe
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(req.file.path),
      model: 'whisper-1',
    });

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      transcript: transcription.text,
    });
  } catch (error) {
    console.error('Transcription error:', error);
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      error: 'Transcription failed',
      message: error.message,
    });
  }
});

module.exports = router;
