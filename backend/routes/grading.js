const express = require('express');
const router = express.Router();
const multer = require('multer');
const OpenAI = require('openai');

const upload = multer({ storage: multer.memoryStorage() });

function getOpenAI() {
  const key = process.env.OPENAI_API_KEY;
  if (!key || !key.trim()) return null;
  return new OpenAI({ apiKey: key });
}

function imagePart(buffer, mimeType) {
  const base64 = buffer.toString('base64');
  return { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64}` } };
}

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

// GPT-4o supports vision (images); use OPENAI_GRADING_MODEL to override (e.g. gpt-4o-mini)
const GRADING_MODEL = process.env.OPENAI_GRADING_MODEL || 'gpt-4o';

router.post('/analyze', upload.fields([
  { name: 'rubric_image', maxCount: 1 },
  { name: 'response_image', maxCount: 1 }
]), async (req, res) => {
  try {
    const openai = getOpenAI();
    if (!openai) {
      return res.status(503).json({
        error: 'Grading is not configured',
        message: 'OPENAI_API_KEY is missing on the server. Add it in Railway environment variables.'
      });
    }

    if (!req.files || !req.files['rubric_image'] || !req.files['response_image']) {
      return res.status(400).json({ error: 'Missing images. Both rubric_image and response_image are required.' });
    }

    const rubricBuffer = req.files['rubric_image'][0].buffer;
    const responseBuffer = req.files['response_image'][0].buffer;
    const rubricMime = req.files['rubric_image'][0].mimetype || 'image/png';
    const responseMime = req.files['response_image'][0].mimetype || 'image/png';
    const context = (req.body && req.body.context) ? String(req.body.context).trim() : '';
    let totalPoints = (req.body && req.body.total_points) ? parseInt(String(req.body.total_points), 10) : null;
    if (totalPoints == null || isNaN(totalPoints) || totalPoints < 1) totalPoints = null;

    // Stage 1: OCR Rubric with OR/AND structure
    const rubricPrompt = `You are an expert grading assistant. Extract the grading criteria from this rubric image.

IMPORTANT - OR vs AND:
- AND: the student MUST meet this criterion (e.g. "Clear thesis", "Two pieces of evidence"). Use or_group: null.
- OR: the student need only satisfy ONE of several alternatives (e.g. "Uses primary OR secondary source", "Either X or Y"). Give each alternative the SAME or_group number (e.g. 1, 2). The group counts as one requirement.

Return ONLY valid JSON in this exact shape (no markdown, no extra text):
{"criteria":[{"text":"criterion text","or_group":null},{"text":"alternative A","or_group":1},{"text":"alternative B","or_group":1}]}

Rules:
- Each criterion object has "text" (string) and "or_group" (null or number).
- Criteria that must all be met: or_group null.
- Alternatives (only one needed): same or_group number for each option (e.g. 1 for first OR group, 2 for second).
- If the rubric is a flat list with no ORs, use or_group null for all.`;

    const rubricCompletion = await openai.chat.completions.create({
      model: GRADING_MODEL,
      messages: [
        { role: 'user', content: [{ type: 'text', text: rubricPrompt }, imagePart(rubricBuffer, rubricMime)] }
      ],
      response_format: { type: 'json_object' },
      max_tokens: 4096
    });

    const rubricText = rubricCompletion.choices[0]?.message?.content || '';
    let criteria = [];
    let rubricPoints = [];
    try {
      const jsonMatch = rubricText.match(/\{[\s\S]*"criteria"[\s\S]*\}/) || rubricText.match(/\{[\s\S]*\}/);
      const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
      if (parsed && Array.isArray(parsed.criteria) && parsed.criteria.length > 0) {
        criteria = parsed.criteria.map(c => ({
          text: typeof c.text === 'string' ? c.text.trim() : String(c.text || '').trim(),
          or_group: c.or_group != null && typeof c.or_group === 'number' ? c.or_group : null
        })).filter(c => c.text.length > 0);
        rubricPoints = criteria.map(c => c.text);
      } else {
        const fallback = rubricText.match(/\[[\s\S]*\]/);
        const arr = fallback ? JSON.parse(fallback[0]) : rubricText.split('\n').map(l => l.trim()).filter(l => l.length > 5);
        rubricPoints = arr.map(s => typeof s === 'string' ? s : String(s));
        criteria = rubricPoints.map(text => ({ text, or_group: null }));
      }
    } catch (error) {
      console.error('Error parsing rubric:', error, rubricText);
      rubricPoints = rubricText.split('\n').map(l => l.trim()).filter(l => l.length > 5);
      criteria = rubricPoints.map(text => ({ text, or_group: null }));
    }

    // Stage 2: Analyze Response (with OR/AND awareness)
    const contextBlock = context
      ? `\nAdditional context from the teacher (use this when judging): ${context}\n`
      : '';
    const orAndExplanation = criteria.some(c => c.or_group != null)
      ? `\nOR vs AND: Some criteria are alternatives (same or_group). For those, the student need only satisfy ONE for the group to count as met. For criteria with or_group null, the student must meet each one. Criteria list with or_group: ${JSON.stringify(criteria)}.\n`
      : '';
    const analysisPrompt = `
      You are an expert educational assistant.

      Rubric criteria (use exactly these strings for rubric_point): ${JSON.stringify(rubricPoints)}
      ${orAndExplanation}
      ${contextBlock}
      Task:
      1. Transcribe the student's response exactly as it appears in the image.
      2. For each rubric criterion, determine if it is met.
      3. For criteria that are OR alternatives (same or_group): the student need only meet ONE of them; mark each alternative as is_met based on whether that specific option is satisfied.
      4. For criteria that are required (AND): mark is_met only if the student satisfies that criterion.
      5. If met, provide the *exact verbatim text segment* from the transcript that supports it and a brief explanation.

      Return ONLY a JSON object:
      {
        "transcript": "The full transcribed text...",
        "analysis": [
          {
            "rubric_point": "The exact criterion text from the list above",
            "is_met": true or false,
            "quote": "Exact verbatim segment from transcript, or empty if not met",
            "explanation": "Why this quote satisfies the point, or why not met"
          }
        ]
      }
    `;

    const analysisCompletion = await openai.chat.completions.create({
      model: GRADING_MODEL,
      messages: [
        { role: 'user', content: [{ type: 'text', text: analysisPrompt }, imagePart(responseBuffer, responseMime)] }
      ],
      response_format: { type: 'json_object' },
      max_tokens: 4096
    });

    const analysisText = analysisCompletion.choices[0]?.message?.content || '';
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
    const metByRubricPoint = {}; // rubric_point -> true if met

    if (data.analysis && Array.isArray(data.analysis)) {
      data.analysis.forEach(item => {
        if (item.is_met && item.quote) {
          metByRubricPoint[item.rubric_point] = true;
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

    // Effective requirements: AND = one per criterion with or_group null; OR = one per distinct or_group (meet any)
    const andCriteria = criteria.filter(c => c.or_group == null);
    const orGroupIds = [...new Set(criteria.map(c => c.or_group).filter(g => g != null))];
    const effectiveTotal = andCriteria.length + orGroupIds.length;
    let effectiveMet = 0;
    effectiveMet += andCriteria.filter(c => metByRubricPoint[c.text]).length;
    for (const gid of orGroupIds) {
      const groupCriteria = criteria.filter(c => c.or_group === gid);
      if (groupCriteria.some(c => metByRubricPoint[c.text])) effectiveMet += 1;
    }

    // Resolve total points: explicit input > parse from context > effective requirement count
    if (totalPoints == null && context) {
      const match = context.match(/\b(?:max(?:imum)?|out of|total)?\s*(?:marks?|points?|pts)\s*(?:being|of)?\s*(\d+)/i)
        || context.match(/(\d+)\s*(?:marks?|points?|pts)\s*(?:total|available)?/i)
        || context.match(/(?:total|out of)\s*(\d+)/i);
      if (match) totalPoints = parseInt(match[1], 10);
    }
    if (totalPoints == null || totalPoints < 1) {
      totalPoints = effectiveTotal > 0 ? effectiveTotal : 1;
    }

    const pointsEarned = effectiveTotal > 0
      ? Math.round((effectiveMet / effectiveTotal) * totalPoints)
      : 0;

    res.json({
      transcript,
      rubric_points: rubricPoints,
      criteria_or_groups: criteria.map(c => c.or_group), // same length as rubric_points: null = AND, number = OR group
      highlights,
      points_earned: pointsEarned,
      total_points: totalPoints,
      effective_met: effectiveMet,
      effective_total: effectiveTotal
    });

  } catch (error) {
    console.error('Grading analysis error:', error);
    const msg = (error.message || '').toLowerCase();
    const isQuota = msg.includes('429') || msg.includes('quota') || msg.includes('too many requests');

    if (isQuota) {
      return res.status(429).json({
        error: 'API quota exceeded',
        message: 'OpenAI rate limit reached. Wait a minute and try again, or check your API usage at https://platform.openai.com/usage.'
      });
    }

    const isDev = process.env.NODE_ENV !== 'production';
    res.status(500).json({
      error: 'Failed to analyze images',
      ...(isDev && { detail: error.message })
    });
  }
});

module.exports = router;
