import { useState, useEffect } from 'react';
import './index.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function App() {
  const [apiStatus, setApiStatus] = useState('checking...');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/status`)
      .then((res) => res.json())
      .then(() => setApiStatus('Connected'))
      .catch(() => setApiStatus(''));
  }, []);

  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      const res = await fetch(`${API_URL}/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), name: name.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitStatus('success');
        setEmail('');
        setName('');
      } else {
        setSubmitStatus(data.error || 'Something went wrong');
      }
    } catch {
      setSubmitStatus('Network error. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <span className="font-bold text-xl text-slate-800">ClassPal</span>
          <span className="text-xs text-slate-500">{apiStatus}</span>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
        <h1 className="text-4xl sm:text-5xl font-black text-slate-800 mb-6 leading-tight">
          Your class. Actionable next steps. In under a minute.
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
          ClassPal is the teacher-first copilot for AP & IB. Get a targeted reteach plan, exit tickets aligned to what you taught, student recaps, and one gentle coaching insight — no surveillance, no admin theater.
        </p>

        {/* Value props */}
        <ul className="flex flex-wrap justify-center gap-4 mb-12 text-slate-600 text-sm">
          <li className="px-4 py-2 bg-slate-100 rounded-full">Targeted 10-min reteach</li>
          <li className="px-4 py-2 bg-slate-100 rounded-full">Quick checks that actually run</li>
          <li className="px-4 py-2 bg-slate-100 rounded-full">Student recap, ready to share</li>
          <li className="px-4 py-2 bg-slate-100 rounded-full">One coaching insight (opt-in)</li>
          <li className="px-4 py-2 bg-slate-100 rounded-full">Teacher-owned, always</li>
        </ul>

        {/* Waitlist */}
        <div id="waitlist" className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Get early access</h2>
          <form onSubmit={handleWaitlistSubmit} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              required
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-slate-400 focus:outline-none"
            />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (optional)"
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 disabled:opacity-50 transition"
            >
              {isSubmitting ? 'Joining…' : 'Join the waitlist'}
            </button>
          </form>
          {submitStatus === 'success' && (
            <p className="mt-3 text-green-600 font-medium">You’re on the list. We’ll be in touch.</p>
          )}
          {submitStatus && submitStatus !== 'success' && (
            <p className="mt-3 text-red-600 text-sm">{submitStatus}</p>
          )}
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-slate-500 text-sm">
        ClassPal — Teacher-first. No surveillance. Your data, your control.
      </footer>
    </div>
  );
}
