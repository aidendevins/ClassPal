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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-6 text-center">Testing Page</h1>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Enter Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter code"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition"
            >
              Unlock
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Audio Recording & Transcription</h1>
            <a
              href="/"
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 transition"
            >
              ← Back to Home
            </a>
          </div>

          <div className="space-y-6">
            {/* Recording Section */}
            <div className="border border-slate-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Step 1: Record Audio</h2>
              <div className="flex items-center gap-4">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                  >
                    <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
                    Start Recording
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="px-6 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition"
                  >
                    Stop Recording
                  </button>
                )}
                {isRecording && (
                  <span className="text-sm text-slate-600 animate-pulse">Recording in progress...</span>
                )}
                {audioBlob && !isRecording && (
                  <span className="text-sm text-green-600 font-medium">✓ Recording saved</span>
                )}
              </div>
            </div>

            {/* Transcription Section */}
            <div className="border border-slate-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Step 2: Get Transcript</h2>
              <button
                onClick={showTranscript}
                disabled={!audioBlob || isTranscribing}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                {isTranscribing ? 'Transcribing...' : 'Show Transcript'}
              </button>
            </div>

            {/* Transcript Display */}
            {transcript && (
              <div className="border border-slate-200 rounded-lg p-6 bg-slate-50">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-slate-900">Transcript</h2>
                  <button
                    onClick={handleUseTranscript}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Use for Analysis →
                  </button>
                </div>
                <div className="prose max-w-none">
                  <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {transcript}
                  </p>
                </div>
              </div>
            )}

            {/* Model Analysis Section */}
            <div className="border-2 border-purple-200 rounded-lg p-6 bg-purple-50/50">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">🤖 AI Model Analysis</h2>
              
              {/* Model Selector */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-900 mb-3">
                  Select AI Model
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* OpenAI Models */}
                  <button
                    onClick={() => setSelectedModel('gpt-4o')}
                    className={`p-4 rounded-lg border-2 transition ${
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
                    className={`p-4 rounded-lg border-2 transition ${
                      selectedModel === 'o1'
                        ? 'border-green-500 bg-green-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-slate-900">o1</div>
                    <div className="text-xs text-slate-600 mt-1">OpenAI • Reasoning</div>
                  </button>

                  {/* Anthropic Models */}
                  <button
                    onClick={() => setSelectedModel('claude-3-5-sonnet-20241022')}
                    className={`p-4 rounded-lg border-2 transition ${
                      selectedModel === 'claude-3-5-sonnet-20241022'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-slate-900">Claude 3.5 Sonnet</div>
                    <div className="text-xs text-slate-600 mt-1">Anthropic • Best</div>
                  </button>

                  {/* Google Models */}
                  <button
                    onClick={() => setSelectedModel('gemini-1.5-pro')}
                    className={`p-4 rounded-lg border-2 transition ${
                      selectedModel === 'gemini-1.5-pro'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-slate-900">Gemini 1.5 Pro</div>
                    <div className="text-xs text-slate-600 mt-1">Google • Long Context</div>
                  </button>

                  {/* Additional models */}
                  <button
                    onClick={() => setSelectedModel('gpt-4o-mini')}
                    className={`p-4 rounded-lg border-2 transition ${
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
                    className={`p-4 rounded-lg border-2 transition ${
                      selectedModel === 'claude-3-5-haiku-20241022'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-slate-900">Claude 3.5 Haiku</div>
                    <div className="text-xs text-slate-600 mt-1">Anthropic • Fast</div>
                  </button>
                </div>
              </div>

              {/* Prompt Input */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Prompt (What to analyze)
                </label>
                <input
                  type="text"
                  value={analysisPrompt}
                  onChange={(e) => setAnalysisPrompt(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="e.g., Summarize the key points..."
                />
              </div>

              {/* Text Input */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Text to Analyze
                </label>
                <textarea
                  value={analysisText}
                  onChange={(e) => setAnalysisText(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
                  placeholder="Paste transcript or text here..."
                />
              </div>

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                disabled={!analysisText.trim() || isAnalyzing}
                className="w-full px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? 'Analyzing...' : `Analyze with ${selectedModel}`}
              </button>
            </div>

            {/* Analysis Display */}
            {analysis && (
              <div className="border border-purple-200 rounded-lg p-6 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-slate-900">Analysis Result</h2>
                  <span className="text-sm text-slate-500">Model: {selectedModel}</span>
                </div>
                <div className="prose max-w-none">
                  <div className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {analysis}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
