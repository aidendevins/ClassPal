// Helper function to find character indices
function findIndices(transcript, substring) {
  const startIndex = transcript.indexOf(substring);
  if (startIndex === -1) {
    return null;
  }
  const endIndex = startIndex + substring.length;
  return { start: startIndex, end: endIndex };
}

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
      `You are an expert educational assistant. Extract a list of grading criteria/points from the rubric image. Return only a JSON array of strings, where each string is a criterion.  Do not include any other text, explanations, or formatting. The JSON should be directly parsable. The image is provided next.`,
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
      rubricPoints = JSON.parse(rubricText);
    } catch (error) {
      console.error('Error parsing rubric points:', error, rubricText);
      return res.status(500).json({ error: 'Failed to extract rubric points.' });
    }

    // Stage 2: Analyze Response
    const analysisPrompt = `
      You are an expert educational assistant.  I am providing you with the following:
      1.  A list of rubric points: ${JSON.stringify(rubricPoints)}
      2.  A student's response (text transcript).

      Your task is:
      1.  Provide the full text transcript of the student's response.
      2.  For each rubric point, identify if it is mentioned or satisfied in the student's transcript.  If it is, provide the EXACT substring from the transcript that corresponds to it.

      Return the result ONLY as a JSON object with the following structure:
      {
        "transcript": "Full student response text...",
        "highlights": [
          {
            "rubric_point": "Point 1",
            "text_segment": "The exact substring from the transcript",
            "explanation": "Brief reason why this satisfies the point",
            "indices": {"start": 0, "end": 10}
          },
          ...
        ]
      }

      Important:
      - The "text_segment" MUST be a verbatim substring of the "transcript".
      - If a rubric point is not found in the student response, do not include it in "highlights".
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
    // Extract JSON if the model wrapped it in markdown code blocks
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from Gemini response");
    }

    let data = JSON.parse(jsonMatch[0]);

    // Add indices to highlights
    if (data.highlights) {
      data.highlights = data.highlights.map(highlight => {
        const startIndex = data.transcript.indexOf(highlight.text_segment);
        const endIndex = startIndex + highlight.text_segment.length;
        const indices = startIndex !== -1 ? { start: startIndex, end: endIndex } : null;
        return {
          ...highlight,
          indices: indices
        };
      });
    }

    res.json(data);

  } catch (error) {
    console.error('Grading analysis error:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze images' });
  }
});

module.exports = router;
