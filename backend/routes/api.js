const express = require('express');
const router = express.Router();
const multer = require('multer');
const OpenAI = require('openai');
const Anthropic = require('@anthropic-ai/sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');
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

// Anthropic client
function getAnthropic() {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

// Google AI client
function getGoogleAI() {
  if (!process.env.GOOGLE_API_KEY) return null;
  return new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
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

    // Rename file with proper extension for OpenAI (uses originalname extension)
    const fileExt = req.file.originalname.split('.').pop();
    const newPath = `${req.file.path}.${fileExt}`;
    fs.renameSync(req.file.path, newPath);

    // Use Whisper API to transcribe
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(newPath),
      model: 'whisper-1',
    });

    // Clean up the renamed file
    // (already deleted above)

    res.json({
      success: true,
      transcript: transcription.text,
    });
  } catch (error) {
    console.error('Transcription error:', error);
    
    // Clean up file if it exists (try both paths)
    if (req.file) {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      const fileExt = req.file.originalname.split('.').pop();
      const newPath = `${req.file.path}.${fileExt}`;
      if (fs.existsSync(newPath)) {
        fs.unlinkSync(newPath);
      }
    }
    
    res.status(500).json({
      error: 'Transcription failed',
      message: error.message,
    });
  }
});

// Analyze text with selected AI model
router.post('/analyze', async (req, res) => {
  try {
    const { model, prompt, text } = req.body;

    if (!model || !prompt || !text) {
      return res.status(400).json({ 
        error: 'Missing required fields: model, prompt, text' 
      });
    }

    let response;
    const systemPrompt = prompt;
    const userContent = text;

    // Route to appropriate provider based on model
    if (model.startsWith('gpt-') || model.startsWith('o1')) {
      // OpenAI models
      const openai = getOpenAI();
      if (!openai) {
        return res.status(500).json({ error: 'OpenAI API key not configured' });
      }

      const completion = await openai.chat.completions.create({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent }
        ],
      });

      response = completion.choices[0].message.content;

    } else if (model.startsWith('claude')) {
      // Anthropic models
      const anthropic = getAnthropic();
      if (!anthropic) {
        return res.status(500).json({ error: 'Anthropic API key not configured' });
      }

      const message = await anthropic.messages.create({
        model: model,
        max_tokens: 4096,
        system: systemPrompt,
        messages: [
          { role: 'user', content: userContent }
        ],
      });

      response = message.content[0].text;

    } else if (model.startsWith('gemini')) {
      // Google models
      const googleAI = getGoogleAI();
      if (!googleAI) {
        return res.status(500).json({ error: 'Google API key not configured' });
      }

      const genModel = googleAI.getGenerativeModel({ model: model });
      const result = await genModel.generateContent(`${systemPrompt}\n\n${userContent}`);
      response = result.response.text();

    } else {
      return res.status(400).json({ error: 'Unknown model' });
    }

    res.json({
      success: true,
      model: model,
      analysis: response,
    });

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      error: 'Analysis failed',
      message: error.message,
    });
  }
});

module.exports = router;
