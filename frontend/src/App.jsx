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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-blue to-accent-purple rounded-lg" />
            <span className="font-bold text-xl text-slate-900">ClassPal</span>
          </div>
          <div className="flex items-center gap-6">
            {apiStatus === 'Connected' && (
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Online
              </span>
            )}
            <a
              href="#waitlist"
              className="px-4 py-2 text-sm font-medium text-slate-900 hover:text-slate-600 transition"
            >
              Join waitlist
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pastel-blue via-white to-pastel-yellow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-sm font-medium text-accent-blue bg-white/80 backdrop-blur rounded-full border border-accent-blue/20">
              <span className="w-1.5 h-1.5 bg-accent-blue rounded-full animate-pulse" />
              Built for AP & IB teachers
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 mb-6 leading-[1.1] tracking-tight">
              Your class turns into
              <span className="block bg-gradient-to-r from-accent-blue via-accent-purple to-accent-pink bg-clip-text text-transparent">
                actionable next steps
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              ClassPal is the teacher-first copilot that delivers targeted reteach plans, exit tickets, student recaps, and gentle coaching—in under 60 seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="#waitlist"
                className="px-8 py-4 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition shadow-lg hover:shadow-xl"
              >
                Get early access
              </a>
              <span className="text-sm text-slate-500">No surveillance. Teacher-owned.</span>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-pastel-pink/30 to-transparent pointer-events-none" />
      </section>

      {/* Trust bar */}
      <section className="bg-slate-50 border-y border-slate-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-slate-500 mb-4">
            Designed with feedback from AP Biology, AP Chemistry, and IB teachers
          </p>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Reteach takes half the class. Exit tickets never happen. Coaching feels like judgment.
            </h2>
            <p className="text-lg text-slate-600">
              You know what didn't land, but figuring out why—and what to do tomorrow—takes time you don't have.
            </p>
          </div>
        </div>
      </section>

      {/* Solution - Key outputs */}
      <section className="py-20 sm:py-32 bg-gradient-to-b from-white to-pastel-yellow/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              After each class, you get four things
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Specific to your objectives, your textbook, your class. Ready to use in under a minute.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Output 1 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-gradient-to-br from-accent-blue to-accent-blue/60 rounded-xl mb-4 flex items-center justify-center text-white font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">10-minute targeted reteach</h3>
              <p className="text-slate-600 mb-4">
                Not "restart the whole concept." A mini-lesson for tomorrow—two options, block-schedule aware, grounded in what actually confused students.
              </p>
              <div className="text-sm text-slate-500 bg-pastel-blue px-3 py-1.5 rounded-lg inline-block">
                Cites objectives, timestamps, student questions
              </div>
            </div>

            {/* Output 2 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-gradient-to-br from-accent-pink to-accent-pink/60 rounded-xl mb-4 flex items-center justify-center text-white font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Exit ticket that actually runs</h3>
              <p className="text-slate-600 mb-4">
                5 questions aligned to what you taught today. Answer key + misconception mapping. Real-time or next-day warmup.
              </p>
              <div className="text-sm text-slate-500 bg-pastel-pink px-3 py-1.5 rounded-lg inline-block">
                AP/IB exam-style rigor
              </div>
            </div>

            {/* Output 3 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-gradient-to-br from-accent-purple to-accent-purple/60 rounded-xl mb-4 flex items-center justify-center text-white font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Student recap, ready to share</h3>
              <p className="text-slate-600 mb-4">
                Key objectives, vocab, what to study, 3 practice prompts, textbook page refs. Send to students in one click.
              </p>
              <div className="text-sm text-slate-500 bg-pastel-purple px-3 py-1.5 rounded-lg inline-block">
                Specific to your class
              </div>
            </div>

            {/* Output 4 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-gradient-to-br from-accent-yellow to-accent-yellow/60 rounded-xl mb-4 flex items-center justify-center text-white font-bold text-xl">
                4
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">One coaching insight (opt-in)</h3>
              <p className="text-slate-600 mb-4">
                Glow + grow. Evidence-based, kind, concrete fix. One insight per lesson—never judgment, always actionable.
              </p>
              <div className="text-sm text-slate-500 bg-pastel-yellow px-3 py-1.5 rounded-lg inline-block">
                Optional, bite-sized, teacher-only
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 sm:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Simple enough to use every day
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Fits your routine. Low friction. No admin theater.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-blue to-accent-purple rounded-2xl mx-auto mb-4 flex items-center justify-center text-white font-bold text-2xl">
                1
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Teach your class</h3>
              <p className="text-slate-600">
                ClassPal runs in the background. No setup, no interruption.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-purple to-accent-pink rounded-2xl mx-auto mb-4 flex items-center justify-center text-white font-bold text-2xl">
                2
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Get your outputs</h3>
              <p className="text-slate-600">
                Reteach, exit ticket, student recap, coaching insight—ready in under 60 seconds.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-pink to-accent-yellow rounded-2xl mx-auto mb-4 flex items-center justify-center text-white font-bold text-2xl">
                3
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Use them tomorrow</h3>
              <p className="text-slate-600">
                Run the reteach. Share the recap. Iterate. Specific to your class, every time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-20 sm:py-32 bg-gradient-to-b from-pastel-blue/20 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Built on principles that matter
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-2">Teacher-first, teacher-owned</h4>
              <p className="text-sm text-slate-600">No admin dashboards by default. Nothing shared without your explicit action.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-2">Not surveillance</h4>
              <p className="text-sm text-slate-600">Your assistant, not your evaluator. All data stays with you.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-2">Action in under 60 seconds</h4>
              <p className="text-sm text-slate-600">Outputs you can use immediately. No dashboards, no analysis paralysis.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-2">Specific to your class</h4>
              <p className="text-sm text-slate-600">Cites your objectives, textbook refs, timestamps, student questions.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-2">AP/IB fidelity</h4>
              <p className="text-sm text-slate-600">Exam-style rigor, long-answer support, pacing realism.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-2">Coaching that's kind</h4>
              <p className="text-sm text-slate-600">Opt-in, bite-sized, glow + grow. One insight, always actionable.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist CTA */}
      <section id="waitlist" className="py-20 sm:py-32 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Get early access
            </h2>
            <p className="text-lg text-slate-300 mb-8">
              Join AP and IB teachers who are testing ClassPal. We'll be in touch when we're ready.
            </p>

            <form onSubmit={handleWaitlistSubmit} className="space-y-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                className="w-full px-5 py-4 rounded-xl border-2 border-slate-700 bg-slate-800/50 text-white placeholder:text-slate-400 focus:border-accent-blue focus:outline-none focus:ring-2 focus:ring-accent-blue/20 transition"
              />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name (optional)"
                className="w-full px-5 py-4 rounded-xl border-2 border-slate-700 bg-slate-800/50 text-white placeholder:text-slate-400 focus:border-accent-blue focus:outline-none focus:ring-2 focus:ring-accent-blue/20 transition"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? 'Joining…' : 'Join the waitlist'}
              </button>
            </form>

            {submitStatus === 'success' && (
              <p className="mt-4 text-green-400 font-medium">You're on the list. We'll be in touch.</p>
            )}
            {submitStatus && submitStatus !== 'success' && (
              <p className="mt-4 text-red-400 text-sm">{submitStatus}</p>
            )}

            <p className="mt-6 text-sm text-slate-400">
              No spam. We'll only reach out when ClassPal is ready.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-accent-blue to-accent-purple rounded-lg" />
              <span className="font-bold text-lg text-slate-900">ClassPal</span>
            </div>
            <p className="text-sm text-slate-500 text-center max-w-md">
              Teacher-first. No surveillance. Your data, your control.
            </p>
            <p className="text-xs text-slate-400">
              © 2026 ClassPal. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
