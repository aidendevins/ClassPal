# ClassPal Build Order — Prioritized by Ease & Model Capability

**Prioritization criteria:**
1. How easy to implement (API complexity, UI, data structures)
2. How good AI models already are at this task (GPT-4o, Claude, Gemini quality)
3. Core value to teachers (from user research)

---

## TIER 1: Quick Wins (1-3 days each) — Models Already Excel

These features are straightforward to implement and AI models handle them extremely well out of the box.

### 1. **Lesson Summary & Objectives** ⭐ START HERE
**Why first:**
- **Easiest:** Single API call with transcript → structured output
- **Model quality:** 10/10 — All models excel at summarization
- **No dependencies:** Just needs transcript
- **High value:** Teachers use weekly, students/parents love it

**Implementation:**
- Input: transcript text
- Prompt: "Summarize this lesson. Extract: (1) what was covered, (2) learning objectives, (3) key vocabulary, (4) textbook references"
- Output: Structured JSON or markdown
- UI: Simple display card with sections
- **Estimated time:** 4-6 hours

**Model recommendation:** GPT-4o (fast, accurate) or Claude 3.5 Sonnet (best quality)

---

### 2. **Student Recap (Shareable Version)**
**Why second:**
- **Very easy:** Almost identical to lesson summary, different audience/tone
- **Model quality:** 10/10 — Tone adaptation is trivial for models
- **Dependencies:** Uses same transcript as #1
- **High value:** Teachers love this for absent students and parent communication

**Implementation:**
- Input: transcript + objectives
- Prompt: "Create a student-facing recap: what we covered, objectives, key vocab, what to review (textbook pages), 3 practice prompts"
- Output: Student-friendly markdown or HTML
- UI: Display card with "Copy" or "Email" button
- **Estimated time:** 3-4 hours (reuse summary logic)

**Model recommendation:** GPT-4o (great at audience adaptation)

---

### 3. **Exit Ticket Generator (5 Questions)**
**Why third:**
- **Easy:** Single API call → structured Q&A
- **Model quality:** 9/10 — Models are excellent at question generation
- **Dependencies:** Just needs transcript or objectives
- **High value:** Teachers rated this 10/10, would use daily

**Implementation:**
- Input: transcript + objectives + textbook info
- Prompt: "Generate 5 formative assessment questions aligned to what was taught today. Include: question, correct answer, 2-3 common misconceptions, AP/IB-style rigor"
- Output: Structured JSON (questions array)
- UI: Question list with answer key toggle
- **Estimated time:** 6-8 hours (includes answer key + misconception mapping)

**Model recommendation:** GPT-4o or Claude 3.5 Sonnet (both excellent at questions)

---

### 4. **Top 3 Confusion Moments**
**Why fourth:**
- **Moderate:** Requires pattern detection in student questions/responses
- **Model quality:** 8/10 — Models are good at this but need clear examples
- **Dependencies:** Needs student questions from transcript (speaker-separated)
- **High value:** Teachers rated 9-10/10, directly improves teaching

**Implementation:**
- Input: transcript with timestamps + student questions highlighted
- Prompt: "Analyze this transcript. Identify the top 3 moments where students showed confusion (wrong answers, repeated questions, 'I don't understand' statements). For each: timestamp, what confused them, student quote, suggested clarification."
- Output: Array of confusion moments with timestamps
- UI: Timeline or list with expandable clarifications
- **Estimated time:** 8-10 hours (requires timestamp parsing and UI)

**Model recommendation:** Claude 3.5 Sonnet (best at nuanced analysis) or o1 (reasoning)

---

### 5. **10-Minute Reteach Plan**
**Why fifth:**
- **Easy-moderate:** Builds on confusion moments + objectives
- **Model quality:** 9/10 — Models are great at instructional planning
- **Dependencies:** Ideally uses output from #4 (confusion moments)
- **High value:** Teachers rated 9/10, directly actionable

**Implementation:**
- Input: confusion moments + objectives not met + transcript
- Prompt: "Create a 10-minute mini-lesson for tomorrow addressing: [confusion points]. Provide two teaching approaches (worked example, group activity). Be specific to what students struggled with. Include block schedule awareness (if 10 min slot available)."
- Output: Structured lesson plan with options
- UI: Two-column layout (Option A vs B)
- **Estimated time:** 6-8 hours

**Model recommendation:** Claude 3.5 Sonnet (best at instructional design) or GPT-4o

---

## TIER 2: Medium Complexity (3-5 days each) — Models Good with Guidance

These require more structured prompts or light data processing, but models still handle them well.

### 6. **Homework/Quiz Question Generator**
**Why sixth:**
- **Moderate:** Similar to exit tickets but longer, needs alignment
- **Model quality:** 9/10 — Models excel at this with standards alignment
- **Dependencies:** Needs syllabus/standards + textbook metadata
- **High value:** Teachers rated 10/10, saves hours per week

**Implementation:**
- Input: objectives + textbook chapter + difficulty level + question count
- Prompt: "Generate [N] AP/IB-style practice questions for [objective]. Mix: 60% multiple choice, 40% short answer. Include answer key, rubric for short answers, aligned to [standard]."
- Output: Question set with answers and rubrics
- UI: Question list, adjustable difficulty, "regenerate" option
- **Estimated time:** 10-12 hours (includes rubric generation)

**Model recommendation:** GPT-4o (fast, accurate) or Claude 3.5 Sonnet

---

### 7. **Time Map (Pacing Analysis)**
**Why seventh:**
- **Moderate:** Requires timestamp parsing and topic segmentation
- **Model quality:** 7-8/10 — Models can identify topics, but precision depends on transcript quality
- **Dependencies:** Needs lesson plan (expected topics + times) for comparison
- **Medium-high value:** Teachers rated 8-9/10, but more valuable when struggling with pacing

**Implementation:**
- Input: transcript with timestamps + lesson plan
- Prompt: "Segment this lesson into topics with time spent on each. Compare to planned times. Identify: (1) what took longer than planned, (2) off-track segments, (3) what got skipped."
- Output: Timeline with actual vs planned, deviations flagged
- UI: Visual timeline/chart (bars or Gantt-style)
- Processing: Need to parse timestamps and chunk transcript by topic
- **Estimated time:** 12-15 hours (includes timeline visualization)

**Model recommendation:** Gemini 1.5 Pro (best at long-form segmentation) or Claude 3.5 Sonnet

---

### 8. **Coaching Insight (Glow + Grow)**
**Why eighth:**
- **Moderate:** Needs careful prompting for tone (kind, not judgmental)
- **Model quality:** 8/10 — Models can do this but need strong guardrails for tone
- **Dependencies:** Uses transcript + time map + talk ratio data
- **Medium value:** Teachers split (8-10/10 for new teachers, 6-7/10 for veterans)

**Implementation:**
- Input: transcript + metadata (time map, talk ratio, confusion moments)
- Prompt: "Provide ONE coaching insight for this lesson. Format: (1) Glow (one specific thing that went well with timestamp), (2) Grow (one concrete improvement with timestamp and actionable fix). Tone: colleague, not evaluator. Evidence-based."
- Output: Glow + grow with timestamps
- UI: Card with opt-in toggle, collapsible
- **Estimated time:** 8-10 hours (includes tone calibration and opt-in logic)

**Model recommendation:** Claude 3.5 Sonnet (best at nuanced, kind tone) or o1 (for reasoning)

---

## TIER 3: Complex (5-10 days each) — Models Need Structure/Iteration

These require more sophisticated data structures, multi-step processing, or are less proven.

### 9. **Teacher Talk vs Student Talk Ratio**
**Why ninth:**
- **Complex:** Requires speaker diarization (who spoke when)
- **Model quality:** N/A (this is audio processing, not text analysis)
- **Dependencies:** Needs Whisper with speaker labels OR separate diarization service
- **Medium value:** 7-8/10 initially, then occasional use

**Implementation:**
- Option A: Use Whisper with speaker labels (if supported)
- Option B: Use separate service (e.g., Deepgram with diarization, AssemblyAI)
- Processing: Calculate % time teacher spoke vs students, segment-by-segment
- Output: Ratio + trend + participation distribution
- UI: Chart (pie or bar) + breakdown by lesson segment
- **Estimated time:** 15-20 hours (includes diarization research/integration)

**Model recommendation:** Not model-dependent; depends on transcription service

---

### 10. **"Where I Left Off" Multi-Section Tracker**
**Why tenth:**
- **Complex:** Requires state management across lessons and sections
- **Model quality:** 7/10 — Models can extract current progress, but state tracking needs DB
- **Dependencies:** Needs lesson history, objectives, multi-section data model
- **High value:** 9/10 for teachers with multiple sections of same course

**Implementation:**
- Data model: Course > Section > Lessons with state (current objective, pending reteach, grading status)
- Input: transcript + objectives + previous lesson state
- Prompt: "Based on today's lesson, update progress: (1) objectives met/partial/not met, (2) where we ended (topic + stopping point), (3) reteach needed for next class"
- Output: Updated state for this section
- UI: Dashboard comparing all sections (Period 3 vs 5 vs 7), color-coded status
- Storage: Needs database (not in-memory)
- **Estimated time:** 20-25 hours (includes DB schema + multi-section UI)

**Model recommendation:** GPT-4o (fast, structured output) or Claude 3.5 Sonnet

---

### 11. **Assignment Time Estimator**
**Why eleventh:**
- **Complex:** Requires understanding assignment structure + estimating student work time
- **Model quality:** 6-7/10 — Models can estimate, but accuracy varies; needs calibration
- **Dependencies:** Needs assignment input (uploaded doc or generated questions)
- **Medium-high value:** 8/10 for preventing student overload

**Implementation:**
- Input: assignment text/questions + student level + other homework context
- Prompt: "Analyze this assignment. Estimate completion time for p25/p50/p75 students. Break down by subtask (reading, problems, writing). Identify bottlenecks. Suggest levers to shorten (remove Q3) or lengthen (add reflection)."
- Output: Time estimate with breakdown + recommendations
- Processing: May need iterative prompting or structured format
- UI: Time breakdown chart, "too long" warnings, adjustment suggestions
- **Estimated time:** 15-20 hours (includes calibration and UI)

**Model recommendation:** o1 (reasoning about complexity) or Claude 3.5 Sonnet

---

## TIER 4: Advanced Features (10+ days each) — Requires Research/Iteration

These are more speculative or require significant backend work beyond AI.

### 12. **Interactive Activity/Lab Builder**
**Why twelfth:**
- **Very complex:** Generating inquiry-based activities is hard; less validated
- **Model quality:** 5-6/10 — Models can suggest activities but quality varies widely
- **Dependencies:** Needs understanding of inquiry pedagogy + lab safety + materials
- **Value:** Potentially high, but unproven

**Implementation:**
- Research phase: Study what makes good inquiry activities
- Prompt engineering: Heavily structured prompts with examples
- Iteration: Likely needs teacher feedback loop to improve
- **Estimated time:** 30-40 hours (R&D heavy)

---

### 13. **Teacher-Owned PD/Admin Report Export**
**Why thirteenth:**
- **Moderate-complex:** Aggregation across lessons + formatted export
- **Model quality:** 8/10 for writing report, but needs data aggregation first
- **Dependencies:** Requires multiple lessons stored + metrics calculated
- **Value:** 8/10 when needed, but infrequent use

**Implementation:**
- Aggregate: Talk ratio trends, confusion patterns, objectives met, coaching insights
- Prompt: "Create a professional development report for [teacher] covering [date range]. Include: teaching strengths (evidence), areas for growth (data-backed), student outcomes."
- Output: PDF or formatted document
- **Estimated time:** 15-20 hours (includes PDF generation)

---

### 14. **Community/Sharing Layer**
**Why last:**
- **Very complex:** Full feature (Reddit-like), separate from core product
- **Not AI-dependent:** This is a social platform feature
- **Long-term:** More valuable after core tools are validated

**Implementation:** 
- Full stack feature (DB, auth, voting, search, moderation)
- **Estimated time:** 100+ hours (separate product)

---

---

## 🎯 RECOMMENDED BUILD ORDER (Next 8 Weeks)

Based on ease + model capability + teacher value:

| Week | Feature | Rationale | Model |
|------|---------|-----------|-------|
| **1** | Lesson Summary + Student Recap | Easiest, models perfect, high value | GPT-4o |
| **2** | Exit Ticket Generator | Easy, models excellent, daily use | GPT-4o / Claude |
| **3** | Confusion Moments | Moderate, models good, transforms teaching | Claude / o1 |
| **4** | 10-Min Reteach Plan | Moderate, builds on #3, actionable | Claude |
| **5** | Homework/Quiz Generator | Moderate, models great, huge time saver | GPT-4o |
| **6** | Coaching Insight | Moderate, tone-sensitive, opt-in | Claude |
| **7-8** | Time Map + Pacing | Complex, needs visualization, high value when struggling | Gemini / Claude |
| **9+** | Where I Left Off (requires DB) | Complex, needs state management | GPT-4o |
| **10+** | Assignment Time Estimator | Complex, needs calibration | o1 / Claude |
| **Later** | Talk Ratio, PD Export, Community | Requires more infrastructure |

---

---

## DETAILED BREAKDOWN BY FEATURE

---

## ✅ TIER 1A: Immediate (Start This Week)

### 1. Lesson Summary & Objectives ⭐

**Ease score:** 9/10 (easiest)  
**Model score:** 10/10 (all models excel)  
**Teacher value:** 8/10 (weekly use)

**Why build first:**
- Single API call, no complex parsing
- Models need minimal prompt engineering
- Immediate value (share with students/parents)
- Foundation for other features (recap, reteach use the summary)

**Implementation steps:**
1. Add `/api/lesson-summary` endpoint
2. Prompt: "Summarize this class. Include: topics covered, objectives addressed, key vocabulary, examples used, textbook/unit references. Be specific."
3. UI: Card on `/testing` with sections (What we covered, Objectives, Vocab, To review)
4. Test with all 3 providers to compare quality
5. Add "Copy" and "Download" buttons

**Prompt template:**
```
You are analyzing a high school [COURSE] lesson transcript.

Extract and format:
1. What was covered (2-3 sentences, specific to this lesson)
2. Learning objectives addressed (list, with codes if available)
3. Key vocabulary introduced or reinforced
4. Examples or analogies the teacher used
5. Textbook/unit references (chapter, pages)

Be specific to THIS lesson. Reference actual content from the transcript.

Transcript:
[TRANSCRIPT_TEXT]
```

**Expected output quality:** All models will do well. Claude might be slightly more elegant in prose; GPT-4o is faster.

---

### 2. Student Recap (Shareable)

**Ease score:** 9/10  
**Model score:** 10/10  
**Teacher value:** 8/10

**Why second:**
- Nearly identical to #1, just different audience
- Models effortlessly adapt tone for students
- Can reuse summary endpoint with `audience: 'student'` parameter

**Implementation steps:**
1. Add `audience` parameter to `/api/lesson-summary`
2. Adjust prompt for student-facing language (2nd person, engaging)
3. Include: "What to study", "Practice prompts" (3 questions students should try)
4. UI: Student-friendly card with "Share via email" or "Copy link"

**Prompt addition:**
```
Format for students (2nd person). Include:
- What we learned today (clear, encouraging tone)
- Key vocabulary (with simple definitions)
- What to review (textbook pages, notes)
- 3 practice questions to try at home
```

**Expected output quality:** Excellent across all models. GPT-4o and Claude both great at this.

---

## ✅ TIER 1B: Quick Wins (Week 2)

### 3. Exit Ticket Generator

**Ease score:** 8/10  
**Model score:** 9/10 (models great at question generation)  
**Teacher value:** 10/10 (would use daily)

**Why third:**
- Models are excellent at generating aligned questions
- Straightforward structured output (JSON)
- Teachers get immediate value (daily use)
- Validates core product value (action > dashboards)

**Implementation steps:**
1. Add `/api/generate-exit-ticket` endpoint
2. Prompt: Generate 5 questions (mix: 2 MC, 2 short answer, 1 application), aligned to today's objectives, AP/IB rigor
3. Include answer key + common misconceptions for each question
4. UI: Question cards, toggle for "Show answers"
5. Export options: Print, copy to Google Forms

**Complexity notes:**
- Need to handle question types (MC, short answer, true/false)
- Answer key must be clear and correct
- Misconception mapping is valuable (why wrong answers are tempting)

**Prompt template:**
```
Generate a 5-question exit ticket for this lesson.

Requirements:
- 2 multiple choice (4 options each)
- 2 short answer (1-2 sentences)
- 1 application problem (show understanding)
- Aligned to objectives: [OBJECTIVES]
- AP/IB exam-style rigor
- Reference specific content from today: [KEY_TOPICS]

For each question provide:
1. Question text
2. Correct answer
3. Answer key explanation
4. 2-3 common misconceptions (for MC: why distractors are tempting)

Lesson context:
[TRANSCRIPT_SUMMARY]
```

**Expected output quality:**
- GPT-4o: 9/10 — Fast, accurate, good at MC distractors
- Claude 3.5 Sonnet: 9/10 — Excellent at nuanced short-answer questions
- Gemini 1.5 Pro: 8/10 — Good but sometimes less rigorous

**Estimated time:** 8 hours (endpoint + UI + testing)

---

## ✅ TIER 2A: Moderate Builds (Week 3-4)

### 4. Top 3 Confusion Moments

**Ease score:** 7/10 (needs pattern detection)  
**Model score:** 8/10 (very good with clear examples)  
**Teacher value:** 10/10 (transformative insight)

**Why fourth:**
- Directly tied to improving teaching
- Models good at this, but requires transcript analysis
- Needs timestamp extraction
- Output feeds into reteach plan (#5)

**Implementation steps:**
1. Add `/api/analyze-confusion` endpoint
2. Process transcript to extract student questions/responses
3. Prompt: Identify confusion signals (wrong answers, repeated questions, silence, "I don't understand")
4. Extract top 3 with timestamps, student quotes, suggested clarifications
5. UI: Timeline view or card list, expandable for clarification details

**Complexity notes:**
- Need to parse timestamps from transcript
- Speaker diarization helps (but not required for MVP)
- Clarifications must be pedagogically sound

**Prompt template:**
```
Analyze this class transcript for student confusion.

Identify the top 3 moments where students showed confusion or misunderstanding:
- Multiple students asking similar questions
- Wrong answers when called on
- Statements like "I don't understand", "Wait, so...", "Is it...?"
- Long silences after a question
- Teacher needing to re-explain multiple times

For each confusion moment:
1. Timestamp (approximate)
2. Topic/concept students struggled with
3. Evidence (quote 1-2 student questions or responses)
4. Number of students affected (estimate)
5. Suggested clarifying explanation (1-2 sentences, use language from this lesson)

Be specific. Reference actual moments from the transcript.

Transcript:
[TRANSCRIPT_WITH_TIMESTAMPS]
```

**Expected output quality:**
- Claude 3.5 Sonnet: 9/10 — Best at identifying subtle confusion and clear explanations
- o1: 9/10 — Strong reasoning about patterns
- GPT-4o: 8/10 — Fast and good, might miss subtle signals

**Estimated time:** 10 hours (analysis + timestamp UI)

---

### 5. 10-Minute Reteach Plan

**Ease score:** 7/10  
**Model score:** 9/10 (models great at instructional planning)  
**Teacher value:** 9/10 (immediately actionable)

**Why fifth:**
- Builds on confusion moments (#4)
- Models excel at creating mini-lessons
- Two teaching options adds value (flexibility)
- Block schedule awareness is a nice touch

**Implementation steps:**
1. Add `/api/generate-reteach` endpoint
2. Input: confusion moments + objectives not fully met
3. Prompt: Create 10-min targeted mini-lesson with 2 teaching approaches
4. Output: Lesson plan with timings, materials, approach A/B
5. UI: Two-column comparison, teacher picks one

**Prompt template:**
```
Create a 10-minute reteach plan for tomorrow addressing these student confusions:

Confusion points from today:
[CONFUSION_MOMENTS]

Objectives not fully met:
[PARTIAL_OBJECTIVES]

Create TWO teaching approaches (teacher can choose one):

Approach A: [Worked Example Method]
- Quick recap (1 min)
- Worked example with think-aloud (5 min)
- Students try similar problem (3 min)
- Check for understanding (1 min)

Approach B: [Interactive/Group Method]
- Quick recap (1 min)
- Pair-share: students explain concept to each other (4 min)
- Common mistakes discussion (3 min)
- Exit question (2 min)

For each approach:
- Be specific to the confusion points (e.g., if mole ratios confused students, use a new mole ratio example)
- List materials needed
- Include check-for-understanding question
- Note: this is for a 10-minute segment, not full class
```

**Expected output quality:**
- Claude 3.5 Sonnet: 10/10 — Excellent at instructional design, thoughtful approaches
- GPT-4o: 9/10 — Very good, slightly more formulaic
- Gemini 1.5 Pro: 8/10 — Good but can be verbose

**Estimated time:** 8 hours

---

## ✅ TIER 2B: Moderate (Week 5)

### 6. Homework/Quiz Generator

**Ease score:** 7/10 (similar to exit tickets, longer)  
**Model score:** 9/10  
**Teacher value:** 10/10 (massive time saver)

**Why sixth:**
- Extends exit ticket logic (#3)
- Models proven at this (existing tools like Quizizz validate)
- Need to add standards alignment + longer question sets
- Rubric generation for open-ended questions

**Implementation steps:**
1. Add `/api/generate-homework` and `/api/generate-quiz`
2. Input: unit/chapter + objectives + question count + difficulty
3. Prompt: Generate N questions (mix of types), aligned to standards, answer key + rubric
4. UI: Question editor (teacher can tweak), export options
5. Add "student workload warning" if estimated time > 45 min

**Complexity notes:**
- Need rubrics for short-answer and essay questions
- Should support different question types (MC, short answer, problem-solving, FRQ for AP)
- Standards alignment (AP Learning Objectives, IB Assessment Statements)

**Estimated time:** 12 hours (includes rubric generation and export)

---

## ✅ TIER 3: Complex Features (Week 6-8)

### 7. Time Map & Pacing Analysis

**Ease score:** 6/10 (timestamp parsing + visualization)  
**Model score:** 7-8/10 (segmentation is good but not perfect)  
**Teacher value:** 8-9/10 (especially for pacing-challenged teachers)

**Why seventh:**
- Requires more data processing (timestamps, topic segmentation)
- Needs visual component (timeline/chart)
- Most valuable when teacher is behind on pacing (not daily use)
- Comparison to lesson plan requires structured input

**Implementation steps:**
1. Add lesson plan input (expected topics + durations)
2. Process transcript into time-stamped segments
3. Model: Identify topics discussed in each segment
4. Compare actual time to planned time
5. Flag: over-time segments, off-track segments, skipped topics
6. UI: Visual timeline with color coding (green: on time, red: over, gray: off-track)
7. Summary: "You spent 6 min extra on limiting reagents, skipped theoretical yield"

**Complexity notes:**
- Timestamp parsing from transcript (format may vary)
- Topic identification accuracy depends on how structured the lesson is
- Need chart library (e.g., Recharts, Chart.js)

**Estimated time:** 15 hours (includes visualization)

---

### 8. Coaching Insight (Opt-In)

**Ease score:** 7/10 (tone calibration is tricky)  
**Model score:** 8/10 (can do well, but needs careful prompting)  
**Teacher value:** 7-9/10 (varies by teacher)

**Why eighth:**
- Requires careful tone (kind, not judgmental)
- Needs evidence from multiple data sources (time map, talk ratio, confusion)
- Opt-in feature (some teachers won't use)
- "Glow + grow" format must feel genuine, not formulaic

**Implementation steps:**
1. Add `/api/coaching-insight` endpoint
2. Input: transcript + time map + confusion moments + (optional) talk ratio
3. Prompt: ONE insight only. Glow (what went well) + Grow (one improvement). Evidence-based, specific timestamps, colleague tone.
4. UI: Collapsible card, opt-in toggle in settings, "View insight" button
5. Feedback loop: "Was this helpful?" for calibration

**Complexity notes:**
- Tone is critical — test extensively to avoid "judgey" feel
- Must cite specific timestamps and evidence
- Balance: can't all be positive (unhelpful) or all critical (discouraging)
- ONE insight per lesson (not a list)

**Estimated time:** 10 hours (includes tone testing)

---

## ✅ TIER 3B: Requires Infrastructure (Week 9+)

### 9. "Where I Left Off" Multi-Section Tracker

**Ease score:** 5/10 (requires database)  
**Model score:** 7/10 (can extract state, but tracking logic is code)  
**Teacher value:** 9/10 (for multi-section teachers)

**Why ninth:**
- Needs persistent storage (not in-memory)
- Tracks state across lessons: objectives met, current topic, pending reteach
- Most valuable for teachers with 3+ sections of same course
- Requires data model: Course > Section > Lesson > State

**Implementation steps:**
1. Add database (PostgreSQL or MongoDB)
2. Schema: Course, Section, Lesson, Objective, State
3. API: `/api/lesson/complete` to mark lesson done and update state
4. Model: Extract progress from transcript (objectives met/partial/not met, where ended)
5. UI: Dashboard comparing all sections side-by-side (color-coded: ahead/on track/behind)

**Estimated time:** 25 hours (DB setup + multi-section UI)

---

### 10. Talk Ratio Analysis

**Ease score:** 4/10 (requires diarization)  
**Model score:** N/A (audio processing, not model task)  
**Teacher value:** 7/10 (insightful but periodic use)

**Why tenth:**
- Requires speaker diarization (Whisper alone doesn't provide this well)
- Need separate service or upgrade transcription (Deepgram, AssemblyAI)
- Processing: Calculate teacher % vs student %, participation distribution
- Less urgent than other features (reflection tool, not action tool)

**Implementation:**
- Research best diarization service (AssemblyAI has good speaker labels)
- May require switching from Whisper or adding parallel service
- Calculate metrics: teacher talk %, student talk %, # of students who spoke
- UI: Donut chart + trend over time

**Estimated time:** 20 hours (diarization research + integration)

---

### 11. Assignment Time Estimator

**Ease score:** 6/10 (estimation is tricky to calibrate)  
**Model score:** 6-7/10 (models can estimate but accuracy varies)  
**Teacher value:** 8/10 (prevents student overload)

**Why eleventh:**
- Models can estimate, but need calibration data to be accurate
- Requires understanding assignment structure (reading, problems, writing)
- Most valuable when integrated with homework generator (#6)
- May need teacher feedback loop ("actual time taken") to improve

**Implementation:**
- API: `/api/estimate-time`
- Input: assignment text/questions + student grade level
- Prompt: "Estimate time for p25/p50/p75 students. Break down: reading time, problem-solving time, writing time. Identify bottlenecks. Suggest ways to shorten or lengthen."
- Output: Time estimates + breakdown + recommendations
- UI: Bar chart (fast/typical/slow students), workload warning if >45 min

**Estimated time:** 18 hours (includes calibration research)

---

---

## 🚀 QUICK START: Build Weeks 1-2 (Foundation)

**Week 1: Core Analysis**
- Day 1-2: Lesson Summary (teacher version) ✅
- Day 3-4: Student Recap (shareable version) ✅
- Day 5: Test, compare models, refine prompts

**Week 2: Daily Use Tools**
- Day 1-2: Exit Ticket Generator ✅
- Day 3-4: Confusion Moments ✅
- Day 5: Integration (confusion → reteach prep)

**End of Week 2 = Usable Product:**
- Teachers can paste transcript
- Get: summary, student recap, exit ticket, confusion analysis
- All daily-use, high-value features
- Ready for beta testing with 3-5 teachers

---

---

## 📊 COMPARISON: Model Capability by Task

| Feature | GPT-4o | o1 | Claude 3.5 Sonnet | Gemini 1.5 Pro | Winner |
|---------|--------|-----|-------------------|----------------|--------|
| Lesson Summary | 9/10 | 8/10 | 10/10 | 9/10 | Claude (prose) |
| Student Recap | 9/10 | 8/10 | 10/10 | 9/10 | Claude |
| Exit Tickets | 9/10 | 8/10 | 9/10 | 8/10 | Tie (GPT-4o/Claude) |
| Confusion Detection | 8/10 | 9/10 | 10/10 | 8/10 | Claude |
| Reteach Plan | 9/10 | 8/10 | 10/10 | 8/10 | Claude |
| Quiz Generator | 9/10 | 8/10 | 9/10 | 8/10 | GPT-4o (speed) |
| Coaching | 8/10 | 8/10 | 10/10 | 7/10 | Claude (tone) |
| Time Map | 8/10 | 7/10 | 9/10 | 9/10 | Gemini (long context) |

**Key takeaway:** Claude 3.5 Sonnet is the best all-around for teaching content. GPT-4o is faster and cheaper for bulk operations. Use Gemini for very long transcripts.

---

---

## 💡 GENERAL IMPLEMENTATION PATTERNS

### For all features:

**1. Start with simple prompt, iterate:**
- Version 1: Basic prompt, see what model produces
- Version 2: Add constraints ("be specific", "cite timestamps")
- Version 3: Add examples in prompt (few-shot) if needed

**2. Make outputs feel "specific to my class":**
- Always include: course name, unit/chapter, objectives, teacher's examples
- Quote student questions verbatim (anonymized)
- Reference textbook pages, slide numbers, lab names
- Use timestamps when relevant

**3. UI patterns:**
- Every output gets: display card, copy button, download/share option
- Include model name badge (for A/B testing)
- Show "regenerate" option if output isn't perfect
- Mobile-responsive (teachers may use on phone between classes)

**4. Backend patterns:**
- POST `/api/[feature-name]` endpoint
- Input validation (require transcript or objectives)
- Model selection parameter (for testing)
- Error handling (return helpful messages)
- Cleanup temp files

---

---

## 🎯 FINAL RECOMMENDATION

**Start with this exact order for maximum momentum:**

1. ✅ **Lesson Summary** (1-2 days) — Foundation, easiest
2. ✅ **Student Recap** (1 day) — Reuse summary logic
3. ✅ **Exit Ticket** (2 days) — High value, daily use
4. ✅ **Confusion Moments** (2-3 days) — Transforms teaching
5. ✅ **Reteach Plan** (2 days) — Builds on #4

**After 5 features (8-10 days of work):**
- You have a complete "after-class workflow"
- Teachers get immediate, actionable outputs
- Ready for real beta testing with 5-10 teachers
- All features work well with current models (minimal R&D risk)

**Then add:**
- Homework/Quiz generator (extends exit ticket)
- Time map (if beta teachers request it)
- Coaching insight (opt-in for reflective teachers)

**Hold for later:**
- Talk ratio (needs diarization)
- Where I left off (needs DB)
- Assignment estimator (needs calibration)
- Community (separate product)

---

This order maximizes:
- ✅ Quick wins (momentum)
- ✅ Model capability (high success rate)
- ✅ Teacher value (daily use)
- ✅ Logical dependencies (each builds on previous)

---

**Ready to start with Lesson Summary (#1)?** It's the perfect first feature — easy, high-value, and sets up everything else.
