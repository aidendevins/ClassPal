import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const Grading = () => {
  const [rubricFile, setRubricFile] = useState(null);
  const [responseFile, setResponseFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const handleAnalyze = async () => {
    if (!rubricFile || !responseFile) {
      setError("Please upload both rubric and response images.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('rubric_image', rubricFile);
    formData.append('response_image', responseFile);

    try {
      const res = await fetch(`${API_URL}/grading/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderTranscriptWithHighlights = () => {
    if (!result || !result.transcript) return null;

    const { transcript, highlights = [] } = result;

    // Filter out invalid highlights and sort by start index
    const sortedHighlights = [...highlights]
      .filter(h => typeof h.start === 'number' && typeof h.end === 'number' && h.start < h.end)
      .sort((a, b) => a.start - b.start);

    const parts = [];
    let lastIndex = 0;

    sortedHighlights.forEach((highlight, index) => {
      // Avoid overlapping highlights for basic Poc rendering
      if (highlight.start < lastIndex) return;

      // Text before the highlight
      if (highlight.start > lastIndex) {
        parts.push(transcript.substring(lastIndex, highlight.start));
      }

      // Highlighted text
      parts.push(
        <span
          key={`highlight-${index}`}
          className={`relative group cursor-help rounded px-1 transition-colors ${
            hoveredPoint === highlight.rubric_point ? 'bg-yellow-200 ring-2 ring-yellow-400' : 'bg-yellow-100'
          }`}
          onMouseEnter={() => setHoveredPoint(highlight.rubric_point)}
          onMouseLeave={() => setHoveredPoint(null)}
        >
          {transcript.substring(highlight.start, highlight.end)}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
            <p className="font-bold mb-1 text-yellow-400">{highlight.rubric_point}</p>
            <p className="leading-relaxed">{highlight.explanation}</p>
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900"></div>
          </div>
        </span>
      );

      lastIndex = highlight.end;
    });

    // Text after the last highlight
    if (lastIndex < transcript.length) {
      parts.push(transcript.substring(lastIndex));
    }

    return (
      <div className="whitespace-pre-wrap leading-relaxed text-slate-800 font-serif text-lg bg-white p-8 rounded-2xl border border-slate-100 shadow-sm min-h-[400px]">
        {parts.length > 0 ? parts : transcript}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#A5C9CA] to-[#E7F6F2] rounded-lg shadow-sm" />
            <span className="font-bold text-xl text-slate-800 tracking-tight">ClassPal <span className="text-slate-400 font-medium">Grading PoC</span></span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!result ? (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Grade with Gemini</h1>
              <p className="text-lg text-slate-600">Upload your rubric and the student's work to see the AI analysis in action.</p>
            </div>

            <div className="grid gap-8 mb-10">
              <div className="p-8 bg-white rounded-3xl border-2 border-dashed border-slate-200 hover:border-blue-300 transition shadow-sm">
                <label className="block text-center cursor-pointer">
                  <div className="mb-4 flex justify-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <span className="block text-lg font-bold text-slate-900 mb-1">Rubric Image</span>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => setRubricFile(e.target.files[0])}
                  />
                  {rubricFile && <div className="mt-2 text-sm text-green-600 font-medium">{rubricFile.name}</div>}
                </label>
              </div>

              <div className="p-8 bg-white rounded-3xl border-2 border-dashed border-slate-200 hover:border-pink-300 transition shadow-sm">
                <label className="block text-center cursor-pointer">
                  <div className="mb-4 flex justify-center">
                    <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                  </div>
                  <span className="block text-lg font-bold text-slate-900 mb-1">Student Response</span>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => setResponseFile(e.target.files[0])}
                  />
                  {responseFile && <div className="mt-2 text-sm text-green-600 font-medium">{responseFile.name}</div>}
                </label>
              </div>
            </div>

            {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-center">{error}</div>}

            <button
              onClick={handleAnalyze}
              disabled={loading || !rubricFile || !responseFile}
              className={`w-full py-4 rounded-2xl font-bold text-white text-lg transition shadow-lg flex items-center justify-center gap-3 ${
                loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800'
              }`}
            >
              {loading ? 'Analyzing with Gemini...' : 'Analyze Submission'}
            </button>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
              <div>
                <button 
                  onClick={() => setResult(null)}
                  className="text-sm font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 mb-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Back to upload
                </button>
                <h1 className="text-3xl font-bold text-slate-900">Grading Analysis</h1>
              </div>
              <div className="flex gap-2">
                 <div className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-semibold border border-green-100">
                   {result.highlights.length} / {result.rubric_points?.length || 0} Points Met
                 </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Transcript</h2>
                </div>
                {renderTranscriptWithHighlights()}
              </div>

              <div className="space-y-4">
                <div className="px-2">
                  <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Rubric Criteria</h2>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <div className="space-y-3">
                    {(result.rubric_points || []).map((point, idx) => {
                      const isSatisfied = result.highlights.some(h => h.rubric_point === point);
                      return (
                        <div 
                          key={idx}
                          onMouseEnter={() => setHoveredPoint(point)}
                          onMouseLeave={() => setHoveredPoint(null)}
                          className={`p-4 rounded-xl border transition-all duration-200 ${
                            hoveredPoint === point 
                              ? 'bg-white border-blue-400 shadow-md translate-x-1' 
                              : isSatisfied 
                                ? 'bg-white/50 border-slate-200' 
                                : 'bg-slate-100 border-transparent opacity-60'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                              isSatisfied ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'
                            }`}>
                              {isSatisfied ? '✓' : '!'}
                            </div>
                            <div>
                              <p className={`font-semibold text-sm ${isSatisfied ? 'text-slate-900' : 'text-slate-500'}`}>
                                {point}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Grading;
