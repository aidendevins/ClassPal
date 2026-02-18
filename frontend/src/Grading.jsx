import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const Grading = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [rubricFile, setRubricFile] = useState(null);
  const [responseFile, setResponseFile] = useState(null);
  const [rubricPreview, setRubricPreview] = useState(null);
  const [responsePreview, setResponsePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [additionalContext, setAdditionalContext] = useState('');
  const [totalPoints, setTotalPoints] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Create preview URLs when files are selected
  useEffect(() => {
    if (rubricFile) {
      const url = URL.createObjectURL(rubricFile);
      setRubricPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setRubricPreview(null);
    }
  }, [rubricFile]);

  useEffect(() => {
    if (responseFile) {
      const url = URL.createObjectURL(responseFile);
      setResponsePreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setResponsePreview(null);
    }
  }, [responseFile]);

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
    if (additionalContext.trim()) {
      formData.append('context', additionalContext.trim());
    }
    const totalNum = totalPoints.trim() ? parseInt(totalPoints.trim(), 10) : null;
    if (totalNum != null && !isNaN(totalNum) && totalNum > 0) {
      formData.append('total_points', String(totalNum));
    }

    try {
      const res = await fetch(`${API_URL}/grading/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        let errorData = {};
        try {
          errorData = await res.json();
        } catch (_) {}
        const msg = errorData.error || errorData.message || 'Analysis failed';
        const detail = errorData.detail ? ` (${errorData.detail})` : '';
        throw new Error(msg + detail);
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to analyze images');
    } finally {
      setLoading(false);
    }
  };

  const renderTranscriptWithHighlights = () => {
    if (!result || !result.transcript) return null;

    const { transcript, highlights = [] } = result;

    // Filter and sort valid highlights
    const validHighlights = highlights
      .filter(h => 
        typeof h.start === 'number' && 
        typeof h.end === 'number' && 
        h.start >= 0 && 
        h.end <= transcript.length &&
        h.start < h.end
      )
      .sort((a, b) => a.start - b.start);

    // Skip overlapping highlights for a clean PoC UI
    const finalHighlights = [];
    let lastEnd = 0;
    for (const h of validHighlights) {
      if (h.start >= lastEnd) {
        finalHighlights.push(h);
        lastEnd = h.end;
      }
    }

    const parts = [];
    let currentIndex = 0;

    finalHighlights.forEach((hl, idx) => {
      // Text before highlight
      if (hl.start > currentIndex) {
        parts.push(transcript.substring(currentIndex, hl.start));
      }

      const isHovered = hoveredPoint === hl.rubric_point;

      parts.push(
        <span
          key={`hl-${idx}`}
          className={`relative group cursor-help rounded px-0.5 transition-all duration-200 border-b-2 ${
            isHovered 
              ? 'bg-yellow-200 border-yellow-500 text-slate-900 z-10' 
              : 'bg-yellow-100 border-yellow-200 text-slate-800'
          }`}
          onMouseEnter={() => setHoveredPoint(hl.rubric_point)}
          onMouseLeave={() => setHoveredPoint(null)}
        >
          {transcript.substring(hl.start, hl.end)}
          
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl scale-95 group-hover:scale-100 origin-bottom duration-200">
            <p className="font-bold text-yellow-400 mb-1">{hl.rubric_point}</p>
            <p className="text-slate-300 leading-relaxed">{hl.explanation}</p>
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900"></div>
          </div>
        </span>
      );

      currentIndex = hl.end;
    });

    if (currentIndex < transcript.length) {
      parts.push(transcript.substring(currentIndex));
    }

    return (
      <div className="whitespace-pre-wrap leading-relaxed text-slate-800 font-serif text-lg bg-white p-8 rounded-2xl border border-slate-100 shadow-sm min-h-[400px]">
        {parts.length > 0 ? parts : transcript}
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-accent-blue to-accent-purple rounded-xl mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-900">Grading</h1>
            <p className="text-sm text-slate-600 mt-2">Password-protected area</p>
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
    <div className="min-h-screen bg-[#FDFCFB]">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg shadow-md flex items-center justify-center text-white font-bold">CP</div>
            <span className="font-bold text-xl text-slate-900">ClassPal <span className="text-slate-400 font-medium">Grading</span></span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {!result ? (
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-black text-slate-900 mb-4">Precision Grading</h1>
            <p className="text-slate-600 mb-12">Upload images to analyze student performance against rubric criteria.</p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className={`p-8 bg-white rounded-3xl border-2 transition-all ${rubricFile ? 'border-indigo-500' : 'border-dashed border-slate-200'}`}>
                <label className="cursor-pointer block">
                  <div className="text-lg font-bold mb-1">Rubric</div>
                  <div className="text-xs text-slate-400 mb-4">Click to upload image</div>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => setRubricFile(e.target.files[0])} />
                  {rubricFile && <div className="text-xs text-green-600 font-bold mb-3">{rubricFile.name}</div>}
                </label>
                {rubricPreview && (
                  <div className="mt-4 border border-slate-200 rounded-xl overflow-hidden">
                    <img src={rubricPreview} alt="Rubric preview" className="w-full h-auto max-h-64 object-contain bg-slate-50" />
                  </div>
                )}
              </div>
              <div className={`p-8 bg-white rounded-3xl border-2 transition-all ${responseFile ? 'border-indigo-500' : 'border-dashed border-slate-200'}`}>
                <label className="cursor-pointer block">
                  <div className="text-lg font-bold mb-1">Student Work</div>
                  <div className="text-xs text-slate-400 mb-4">Handwritten or typed</div>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => setResponseFile(e.target.files[0])} />
                  {responseFile && <div className="text-xs text-green-600 font-bold mb-3">{responseFile.name}</div>}
                </label>
                {responsePreview && (
                  <div className="mt-4 border border-slate-200 rounded-xl overflow-hidden">
                    <img src={responsePreview} alt="Student work preview" className="w-full h-auto max-h-64 object-contain bg-slate-50" />
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-900 mb-2">Additional context (optional)</label>
              <textarea
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
                placeholder="e.g. This is an IB style question with the maximum number of marks being 7."
                rows={3}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 placeholder-slate-400"
              />
              <p className="text-xs text-slate-500 mt-1">Add grading context (question type, max marks, subject, etc.) to improve analysis.</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-900 mb-2">Total points for this question (optional)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={totalPoints}
                onChange={(e) => setTotalPoints(e.target.value)}
                placeholder="e.g. 7"
                className="w-32 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 placeholder-slate-400"
              />
              <p className="text-xs text-slate-500 mt-1">Used to show grade as points earned / total (e.g. 5/7). If blank, total = number of rubric criteria.</p>
            </div>

            {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100">{error}</div>}

            <button
              onClick={handleAnalyze}
              disabled={loading || !rubricFile || !responseFile}
              className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all ${loading ? 'bg-slate-400' : 'bg-slate-900 hover:bg-slate-800 hover:-translate-y-0.5'}`}
            >
              {loading ? 'Processing...' : 'Run Analysis'}
            </button>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <button onClick={() => setResult(null)} className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors">← Start Over</button>
              <div className="flex items-center gap-4">
                <div className="px-5 py-3 bg-slate-900 text-white rounded-xl font-bold text-lg">
                  Grade: {result.points_earned != null ? result.points_earned : result.highlights.length} / {result.total_points != null ? result.total_points : (result.rubric_points?.length || 0)}
                </div>
                <div className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-bold border border-green-100">
                  {result.highlights.length} / {result.rubric_points?.length || 0} criteria met
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-start">
              <div>
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Student Response</h2>
                {renderTranscriptWithHighlights()}
              </div>
              <div>
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Grading Criteria</h2>
                <div className="space-y-3">
                  {(result.rubric_points || []).map((point, idx) => {
                    const isSatisfied = result.highlights.some(h => h.rubric_point === point);
                    const isHovered = hoveredPoint === point;
                    return (
                      <div 
                        key={idx}
                        className={`p-4 rounded-xl border transition-all ${isHovered ? 'bg-indigo-50 border-indigo-200' : isSatisfied ? 'bg-white border-slate-200' : 'bg-slate-50 border-transparent opacity-60'}`}
                        onMouseEnter={() => setHoveredPoint(point)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      >
                        <p className={`text-sm font-medium ${isSatisfied ? 'text-slate-900' : 'text-slate-500'}`}>{point}</p>
                      </div>
                    );
                  })}
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
