import { useState, useRef } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function Testing() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  
  // Model analysis state
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [analysisPrompt, setAnalysisPrompt] = useState('Summarize the key points from this text:');
  const [analysisText, setAnalysisText] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Lesson summary state
  const [summaryModel, setSummaryModel] = useState('claude-3-5-sonnet-20241022');
  const [lessonSummary, setLessonSummary] = useState(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [courseInfo, setCourseInfo] = useState({
    courseName: 'AP Chemistry',
    unit: 'Unit 4: Stoichiometry',
    objectives: ['4.2.A: Calculate limiting reagent', '4.2.B: Apply mole ratios'],
    textbookRef: 'Zumdahl Ch 4, pp 142-145',
  });
  
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === '0612') {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      alert('Incorrect password');
      setPassword('');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm;codecs=opus' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setTranscript('');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please grant permission.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const showTranscript = async () => {
    if (!audioBlob) {
      alert('Please record audio first');
      return;
    }

    setIsTranscribing(true);
    setTranscript('');

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await fetch(`${API_URL}/transcribe`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok) {
        setTranscript(data.transcript);
      } else {
        alert(data.error || 'Transcription failed');
      }
    } catch (error) {
      console.error('Transcription error:', error);
      alert('Failed to transcribe audio');
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleAnalyze = async () => {
    if (!analysisText.trim()) {
      alert('Please enter text to analyze');
      return;
    }

    setIsAnalyzing(true);
    setAnalysis('');

    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModel,
          prompt: analysisPrompt,
          text: analysisText,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setAnalysis(data.analysis);
      } else {
        alert(data.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze text');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUseTranscript = () => {
    setAnalysisText(transcript);
  };

  const generateLessonSummary = async () => {
    if (!transcript.trim()) {
      alert('Please generate a transcript first');
      return;
    }

    setIsGeneratingSummary(true);
    setLessonSummary(null);

    try {
      const response = await fetch(`${API_URL}/lesson-summary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript,
          model: summaryModel,
          courseInfo,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setLessonSummary(data.summary);
      } else {
        alert(data.error || 'Summary generation failed');
      }
    } catch (error) {
      console.error('Summary error:', error);
      alert('Failed to generate summary');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-accent-blue to-accent-purple rounded-xl mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-900">Testing Lab</h1>
            <p className="text-sm text-slate-600 mt-2">Password-protected development area</p>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Enter Access Code
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="••••"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition shadow-lg"
            >
              Unlock
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-blue to-accent-purple rounded-lg" />
            <div>
              <h1 className="text-xl font-bold text-slate-900">ClassPal Testing Lab</h1>
              <p className="text-xs text-slate-500">AI Model Comparison & Development</p>
            </div>
          </div>
          <a
            href="/"
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 transition font-medium"
          >
            ← Home
          </a>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Recording & Transcription Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-pastel-blue to-pastel-pink p-6 border-b border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900">🎙️ Step 1: Record & Transcribe</h2>
            <p className="text-sm text-slate-600 mt-1">Capture your lesson audio and get a transcript</p>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Recording Controls */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-3">Audio Recording</label>
              <div className="flex items-center gap-4 flex-wrap">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition shadow-lg flex items-center gap-2"
                  >
                    <span className="w-3 h-3 bg-white rounded-full"></span>
                    Start Recording
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="px-6 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition shadow-lg"
                  >
                    ⏹ Stop Recording
                  </button>
                )}
                {isRecording && (
                  <span className="text-sm text-red-600 font-medium flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                    Recording in progress...
                  </span>
                )}
                {audioBlob && !isRecording && (
                  <span className="text-sm text-green-600 font-medium flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Recording saved
                  </span>
                )}
              </div>
            </div>

            {/* Transcription */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-3">Get Transcript</label>
              <button
                onClick={showTranscript}
                disabled={!audioBlob || isTranscribing}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-lg disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                {isTranscribing ? 'Transcribing...' : '📝 Generate Transcript'}
              </button>
            </div>

            {/* Transcript Display */}
            {transcript && (
              <div className="border border-slate-200 rounded-xl p-6 bg-slate-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900">Transcript</h3>
                  <button
                    onClick={handleUseTranscript}
                    className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Use for Analysis →
                  </button>
                </div>
                <div className="prose max-w-none">
                  <p className="text-slate-700 text-sm whitespace-pre-wrap leading-relaxed font-mono bg-white p-4 rounded-lg border border-slate-200">
                    {transcript}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Lesson Summary Section */}
        {transcript && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-pastel-yellow to-pastel-pink p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900">📚 Lesson Summary & Objectives</h2>
              <p className="text-sm text-slate-600 mt-1">AI-generated summary specific to your class</p>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Model Selector for Summary */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">Select AI Model</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => setSummaryModel('gpt-4o')}
                    className={`p-3 rounded-xl border-2 transition ${
                      summaryModel === 'gpt-4o'
                        ? 'border-green-500 bg-green-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-slate-900 text-sm">GPT-4o</div>
                    <div className="text-xs text-slate-600">Fast</div>
                  </button>
                  <button
                    onClick={() => setSummaryModel('claude-3-5-sonnet-20241022')}
                    className={`p-3 rounded-xl border-2 transition ${
                      summaryModel === 'claude-3-5-sonnet-20241022'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-slate-900 text-sm">Claude 3.5</div>
                    <div className="text-xs text-slate-600">Best</div>
                  </button>
                  <button
                    onClick={() => setSummaryModel('gemini-1.5-pro')}
                    className={`p-3 rounded-xl border-2 transition ${
                      summaryModel === 'gemini-1.5-pro'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-slate-900 text-sm">Gemini 1.5</div>
                    <div className="text-xs text-slate-600">Long Context</div>
                  </button>
                </div>
              </div>

              {/* Course Info (Collapsible) */}
              <details className="border border-slate-200 rounded-xl overflow-hidden">
                <summary className="px-4 py-3 bg-slate-50 cursor-pointer hover:bg-slate-100 transition font-semibold text-sm text-slate-900">
                  📖 Course Info (Optional)
                </summary>
                <div className="p-4 space-y-3 bg-white">
                  <input
                    type="text"
                    placeholder="Course name (e.g., AP Chemistry)"
                    value={courseInfo.courseName}
                    onChange={(e) => setCourseInfo({...courseInfo, courseName: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Unit (e.g., Unit 4: Stoichiometry)"
                    value={courseInfo.unit}
                    onChange={(e) => setCourseInfo({...courseInfo, unit: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Textbook reference (e.g., Zumdahl Ch 4, pp 142-145)"
                    value={courseInfo.textbookRef}
                    onChange={(e) => setCourseInfo({...courseInfo, textbookRef: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
              </details>

              {/* Generate Button */}
              <button
                onClick={generateLessonSummary}
                disabled={isGeneratingSummary}
                className="w-full px-6 py-4 bg-gradient-to-r from-accent-yellow to-accent-pink text-white font-bold rounded-xl hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {isGeneratingSummary ? '⏳ Generating Summary...' : '✨ Generate Lesson Summary'}
              </button>
            </div>

            {/* Summary Display */}
            {lessonSummary && (
              <div className="border-t border-slate-200 p-6 bg-gradient-to-br from-white to-slate-50">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Generated Summary</h3>
                    <p className="text-xs text-slate-500 mt-1">Model: {summaryModel}</p>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(JSON.stringify(lessonSummary, null, 2))}
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition text-sm font-medium"
                  >
                    📋 Copy
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Summary */}
                  <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                    <h4 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">What We Covered</h4>
                    <p className="text-slate-700 leading-relaxed">{lessonSummary.summary}</p>
                  </div>

                  {/* Objectives */}
                  {lessonSummary.objectives && lessonSummary.objectives.length > 0 && (
                    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                      <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wide">Learning Objectives</h4>
                      <div className="space-y-2">
                        {lessonSummary.objectives.map((obj, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <span className={`mt-0.5 ${
                              obj.status === 'met' ? 'text-green-500' :
                              obj.status === 'partial' ? 'text-yellow-500' :
                              'text-slate-400'
                            }`}>
                              {obj.status === 'met' ? '✓' : obj.status === 'partial' ? '◐' : '○'}
                            </span>
                            <div className="flex-1">
                              <span className="text-slate-900">{obj.text}</span>
                              {obj.code && <span className="text-xs text-slate-500 ml-2">({obj.code})</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Vocabulary */}
                  {lessonSummary.vocabulary && lessonSummary.vocabulary.length > 0 && (
                    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                      <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wide">Key Vocabulary</h4>
                      <div className="flex flex-wrap gap-2">
                        {lessonSummary.vocabulary.map((term, idx) => (
                          <span key={idx} className="px-3 py-1.5 bg-pastel-blue text-slate-900 rounded-lg text-sm font-medium">
                            {term}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Examples */}
                  {lessonSummary.examples && lessonSummary.examples.length > 0 && (
                    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                      <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wide">Teacher Examples</h4>
                      <ul className="space-y-2">
                        {lessonSummary.examples.map((ex, idx) => (
                          <li key={idx} className="text-slate-700 text-sm leading-relaxed">
                            • {ex}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* To Review */}
                  {lessonSummary.textbookRefs && lessonSummary.textbookRefs.length > 0 && (
                    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                      <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wide">To Review</h4>
                      <ul className="space-y-2">
                        {lessonSummary.textbookRefs.map((ref, idx) => (
                          <li key={idx} className="text-slate-700 text-sm">
                            • {ref}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Next Steps */}
                  {lessonSummary.nextSteps && (
                    <div className="bg-gradient-to-br from-pastel-yellow to-white rounded-xl p-5 border border-yellow-200 shadow-sm">
                      <h4 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">Next Class</h4>
                      <p className="text-slate-700 leading-relaxed">{lessonSummary.nextSteps}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
        </div>
        )}

        {/* Model Comparison Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-pastel-purple to-pastel-blue p-6 border-b border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900">🤖 Step 2: Model Testing (Advanced)</h2>
            <p className="text-sm text-slate-600 mt-1">Compare AI models with custom prompts</p>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Model Selector */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-3">Select Model</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setSelectedModel('gpt-4o')}
                  className={`p-4 rounded-xl border-2 transition ${
                    selectedModel === 'gpt-4o'
                      ? 'border-green-500 bg-green-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-slate-900">GPT-4o</div>
                  <div className="text-xs text-slate-600 mt-1">OpenAI • Fast</div>
                </button>
                <button
                  onClick={() => setSelectedModel('o1')}
                  className={`p-4 rounded-xl border-2 transition ${
                    selectedModel === 'o1'
                      ? 'border-green-500 bg-green-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-slate-900">o1</div>
                  <div className="text-xs text-slate-600 mt-1">OpenAI • Reasoning</div>
                </button>
                <button
                  onClick={() => setSelectedModel('claude-3-5-sonnet-20241022')}
                  className={`p-4 rounded-xl border-2 transition ${
                    selectedModel === 'claude-3-5-sonnet-20241022'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-slate-900">Claude 3.5</div>
                  <div className="text-xs text-slate-600 mt-1">Anthropic • Best</div>
                </button>
                <button
                  onClick={() => setSelectedModel('gemini-1.5-pro')}
                  className={`p-4 rounded-xl border-2 transition ${
                    selectedModel === 'gemini-1.5-pro'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-slate-900">Gemini 1.5</div>
                  <div className="text-xs text-slate-600 mt-1">Google • Long</div>
                </button>
                <button
                  onClick={() => setSelectedModel('gpt-4o-mini')}
                  className={`p-4 rounded-xl border-2 transition ${
                    selectedModel === 'gpt-4o-mini'
                      ? 'border-green-500 bg-green-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-slate-900">GPT-4o mini</div>
                  <div className="text-xs text-slate-600 mt-1">OpenAI • Cheap</div>
                </button>
                <button
                  onClick={() => setSelectedModel('claude-3-5-haiku-20241022')}
                  className={`p-4 rounded-xl border-2 transition ${
                    selectedModel === 'claude-3-5-haiku-20241022'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-slate-900">Claude Haiku</div>
                  <div className="text-xs text-slate-600 mt-1">Anthropic • Fast</div>
                </button>
              </div>
            </div>

            {/* Prompt Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Custom Prompt
              </label>
              <input
                type="text"
                value={analysisPrompt}
                onChange={(e) => setAnalysisPrompt(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                placeholder="What should the model analyze?"
              />
            </div>

            {/* Text Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Text to Analyze
              </label>
              <textarea
                value={analysisText}
                onChange={(e) => setAnalysisText(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
                placeholder="Paste transcript or any text here..."
              />
            </div>

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={!analysisText.trim() || isAnalyzing}
              className="w-full px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition disabled:bg-slate-300 disabled:cursor-not-allowed shadow-lg"
            >
              {isAnalyzing ? 'Analyzing...' : `🔍 Analyze with ${selectedModel}`}
            </button>

            {/* Analysis Result */}
            {analysis && (
              <div className="border border-purple-200 rounded-xl p-6 bg-purple-50/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900">Analysis Result</h3>
                  <span className="text-xs text-slate-500 bg-white px-3 py-1 rounded-full">{selectedModel}</span>
                </div>
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <p className="text-slate-700 whitespace-pre-wrap leading-relaxed text-sm">
                    {analysis}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
