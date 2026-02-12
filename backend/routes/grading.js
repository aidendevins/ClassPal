const express = require('express');
const router = express.Router();
const multer = require('multer');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const upload = multer({ storage: multer.memoryStorage() });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

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

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Stage 1: OCR Rubric
    const rubricResult = await model.generateContent([
      `You are an expert educational assistant. Extract a list of grading criteria/points from the rubric image. Return only a JSON array of strings, where each string is a criterion. Do not include any other text, explanations, or formatting. The JSON should be directly parsable. The image is provided next.`,
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
      // Clean potential markdown wrap
      const cleanRubricText = rubricText.match(/\[[\s\S]*\]/)?.[0] || rubricText;
      rubricPoints = JSON.parse(cleanRubricText);
    } catch (error) {
      console.error('Error parsing rubric points:', error, rubricText);
      return res.status(500).json({ error: 'Failed to extract rubric points.' });
    }

    // Stage 2: Analyze Response
    const analysisPrompt = `
      You are an expert educational assistant. I am providing you with the following:
      1. A list of rubric points: ${JSON.stringify(rubricPoints)}
      2. A student's response (image).

      Your task is:
      1. Transcribe the student's response completely.
      2. For each rubric point, identify if it is mentioned or satisfied in the student's transcript.
      3. For each satisfied point, identify the EXACT start and end character indices of the corresponding 'text_segment' within your 'transcript'.

      Return the result ONLY as a JSON object with the following structure:
      {
        "transcript": "Full student response text...",
        "highlights": [
          {
            "rubric_point": "The original rubric point text",
            "text_segment": "The exact verbatim substring from the transcript",
            "explanation": "Brief reason why this satisfies the point",
            "start": 0,
            "end": 10
          }
        ],
        "rubric_points": ${JSON.stringify(rubricPoints)}
      }

      Important:
      - The 'start' and 'end' indices MUST be correct relative to the 'transcript' string you provide.
      - 'end' should be the index of the character immediately AFTER the segment (standard slice/substring behavior).
      - If a rubric point is not found in the student response, do not include it in "highlights".
      - Return ONLY the JSON object.
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
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from Gemini response");
    }

    let data = JSON.parse(jsonMatch[0]);

    // Ensure rubric_points is included for the frontend if Gemini missed it
    if (!data.rubric_points) {
      data.rubric_points = rubricPoints;
    }

    res.json(data);

  } catch (error) {
    console.error('Grading analysis error:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze images' });
  }
});

module.exports = router;
