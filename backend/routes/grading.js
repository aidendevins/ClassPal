const express = require('express');
const router = express.Router();
const multer = require('multer');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const upload = multer({ storage: multer.memoryStorage() });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

/**
 * Helper: Find the best matching substring indices for a given quote in a text.
 * This handles minor discrepancies (whitespace, punctuation) between the LLM's
 * extracted quote and the full transcript.
 */
function findBestMatch(fullText, quote) {
  if (!quote || !fullText) return null;

  // 1. Try exact match first
  let index = fullText.indexOf(quote);
  if (index !== -1) {
    return { start: index, end: index + quote.length };
  }

  // 2. Normalize both texts (lower case, remove extra whitespace/punctuation) for a "clean" search
  const normalize = (str) => str.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
  
  const normText = normalize(fullText);
  const normQuote = normalize(quote);
  
  const normIndex = normText.indexOf(normQuote);
  
  if (normIndex !== -1) {
    // Map normalized indices back to original indices
    const charsBefore = normText.substring(0, normIndex).replace(/\s/g, '').length;
    const quoteChars = normQuote.replace(/\s/g, '').length;
    
    let originalStart = -1;
    let originalEnd = -1;
    let nonSpaceCount = 0;

    for (let i = 0; i < fullText.length; i++) {
      const isWordChar = /\w/.test(fullText[i]);
      if (isWordChar) nonSpaceCount++;
      
      if (originalStart === -1 && nonSpaceCount === charsBefore + 1) {
        // Find the start of the word
        originalStart = i;
        while (originalStart > 0 && /\w/.test(fullText[originalStart - 1])) {
          originalStart--;
        }
      }
      
      if (originalStart !== -1 && nonSpaceCount === charsBefore + quoteChars) {
        // Find the end of the word
        originalEnd = i + 1;
        while (originalEnd < fullText.length && /\w/.test(fullText[originalEnd])) {
          originalEnd++;
        }
        break;
      }
    }

    if (originalStart !== -1 && originalEnd !== -1) {
      return { start: originalStart, end: originalEnd };
    }
  }

  return null;
}

router.post('/analyze', upload.fields([
  { name: 'rubric_image', maxCount: 1 },
  { name: 'response_image', maxCount: 1 }
]), async (req, res) => {
  try {
    if (!req.files || !req.files['rubric_image'] || !req.files['response_image']) {
      return res.status(400).json({ error: 'Missing images. Both rubric_image and response_image are required.' });
    }

    const rubricBuffer = req.files['rubric_image'][0].buffer;
    const responseBuffer = req.files['response_image'][0].buffer;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    // Stage 1: OCR Rubric
    const rubricResult = await model.generateContent([
      `You are an expert grading assistant. 
       Extract the grading criteria from this rubric image. 
       Return strictly a JSON array of strings. 
       Example: ["Thesis statement is clear", "Evidence is provided"].
       No markdown, no extra text.`,
      {
        inlineData: {
          data: rubricBuffer.toString("base64"),
          mimeType: req.files['rubric_image'][0].mimetype
        }
      }
    ]);

    const rubricText = rubricResult.response.text();
    let rubricPoints = [];
    try {
      const jsonMatch = rubricText.match(/\[[\s\S]*\]/);
      rubricPoints = JSON.parse(jsonMatch ? jsonMatch[0] : rubricText);
    } catch (error) {
      console.error('Error parsing rubric points:', error, rubricText);
      rubricPoints = rubricText.split('\n').map(l => l.trim()).filter(l => l.length > 5);
    }

    // Stage 2: Analyze Response
    const analysisPrompt = `
      You are an expert educational assistant. 
      
      Rubric points: ${JSON.stringify(rubricPoints)}
      
      Task:
      1. Transcribe the student's response exactly as it appears in the image.
      2. For each rubric point, determine if it is met.
      3. If met, identify the *exact verbatim text segment* from the transcript that supports this.
      
      Return ONLY a JSON object:
      {
        "transcript": "The full transcribed text...",
        "analysis": [
          {
            "rubric_point": "The rubric point text",
            "is_met": true,
            "quote": "The exact verbatim text segment from the transcript",
            "explanation": "Why this quote satisfies the point"
          }
        ]
      }
    `;

    const analysisResult = await model.generateContent([
      analysisPrompt,
      {
        inlineData: {
          data: responseBuffer.toString("base64"),
          mimeType: req.files['response_image'][0].mimetype
        }
      }
    ]);

    const analysisText = analysisResult.response.text();
    let data;
    try {
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      data = JSON.parse(jsonMatch ? jsonMatch[0] : analysisText);
    } catch (e) {
      console.error("Failed to parse analysis JSON", analysisText);
      return res.status(500).json({ error: "Failed to parse AI response" });
    }

    const transcript = data.transcript || "";
    const highlights = [];

    if (data.analysis && Array.isArray(data.analysis)) {
      data.analysis.forEach(item => {
        if (item.is_met && item.quote) {
          const match = findBestMatch(transcript, item.quote);
          if (match) {
            highlights.push({
              rubric_point: item.rubric_point,
              text_segment: item.quote,
              explanation: item.explanation,
              start: match.start,
              end: match.end
            });
          }
        }
      });
    }

    res.json({
      transcript,
      rubric_points: rubricPoints,
      highlights
    });

  } catch (error) {
    console.error('Grading analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze images' });
  }
});

module.exports = router;
