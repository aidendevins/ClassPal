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
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100">
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
              className="hidden sm:inline-flex px-5 py-2.5 text-sm font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
            >
              Get early access
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pastel-blue/40 via-white to-pastel-yellow/30 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-medium text-slate-700 bg-white/90 backdrop-blur rounded-full border border-slate-200 shadow-sm">
            <span className="w-2 h-2 bg-gradient-to-r from-accent-blue to-accent-purple rounded-full" />
            Built for AP & IB teachers
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 mb-8 leading-[1.05] tracking-tight max-w-5xl mx-auto">
            Your teaching expertise,
            <br />
            <span className="bg-gradient-to-r from-accent-blue via-accent-purple to-accent-pink bg-clip-text text-transparent">
              supercharged.
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto">
            The teacher copilot that makes you sharper, students stronger, and teaching easier—with data-driven insights and classroom-ready tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
            <a
              href="#waitlist"
              className="px-8 py-4 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition shadow-lg hover:shadow-xl text-lg"
            >
              Get ClassPal for free
            </a>
          </div>
          <p className="text-sm text-slate-500">
            For AP Biology, AP Chemistry, IB, and more
          </p>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-slate-100 bg-slate-50/50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-slate-500">
            Designed with real teachers, for real classrooms
          </p>
        </div>
      </section>

      {/* Main Problem */}
      <section className="relative py-20 sm:py-32 overflow-hidden">
        {/* Decorative gradients */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-pastel-blue to-transparent opacity-30 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-pastel-pink to-transparent opacity-30 blur-3xl pointer-events-none" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-8 leading-tight">
              Every class generates insights that could make tomorrow better.
              <br />
              <span className="bg-gradient-to-r from-accent-blue via-accent-purple to-accent-pink bg-clip-text text-transparent">
                Imagine using them all.
              </span>
            </h2>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-12">
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-accent-pink flex-shrink-0" />
                <p className="text-lg text-slate-700">Who was confused at 18:15</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-accent-blue flex-shrink-0" />
                <p className="text-lg text-slate-700">What took 10 min too long</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-accent-purple flex-shrink-0" />
                <p className="text-lg text-slate-700">Where Period 3 left off vs Period 5</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-accent-yellow flex-shrink-0" />
                <p className="text-lg text-slate-700">What students need reteaching</p>
              </div>
            </div>
            
            <div className="pt-8 border-t border-slate-200 text-center">
              <p className="text-xl sm:text-2xl font-medium text-slate-900 mb-4">
                One insight makes tomorrow 5% better.
                <br />
                <span className="text-slate-600">180 days of insights? That's a different teacher.</span>
              </p>
              <p className="text-lg text-slate-600">
                ClassPal captures them all—so you and your students improve every single day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Four core insights */}
      <section className="relative py-20 sm:py-32 bg-gradient-to-b from-white via-pastel-yellow/30 to-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 right-0 w-72 h-72 bg-gradient-to-br from-pastel-purple to-transparent opacity-20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-0 w-72 h-72 bg-gradient-to-tr from-pastel-blue to-transparent opacity-20 blur-3xl pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white/80 backdrop-blur rounded-full border border-slate-200 shadow-sm">
              <span className="w-2 h-2 bg-gradient-to-r from-accent-blue to-accent-pink rounded-full" />
              <span className="text-sm font-medium text-slate-700">Four core insights</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              After each class, you get what you'd create—if you had the time
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Four insights you already know you need. ClassPal just does the legwork.
            </p>
          </div>

          {/* Four Equal Insights */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {/* 1. Confusion Moments */}
            <div className="group relative bg-white p-8 rounded-2xl border-2 border-accent-pink/20 hover:border-accent-pink/40 shadow-lg hover:shadow-xl transition-all">
              <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-accent-pink to-accent-pink/60 rounded-xl opacity-20 group-hover:opacity-30 transition" />
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-sm font-medium text-accent-pink bg-pastel-pink/50 rounded-full border border-accent-pink/30">
                Confusion moments
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Where students got lost—and why
              </h3>
              <p className="text-slate-600 mb-6">
                You'd analyze every student question if you had time. ClassPal does it for you—showing top 3 confusion moments with timestamps and clarifications.
              </p>
              <div className="bg-pastel-pink/30 rounded-xl p-4 border border-accent-pink/20">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">TOP CONFUSION</div>
                <div className="text-sm font-medium text-slate-900 mb-1">Mole ratio calculation at 18:15</div>
                <div className="text-xs text-slate-600">8 students asked "which coefficient to use?"</div>
              </div>
            </div>

            {/* 2. Time Map */}
            <div className="group relative bg-white p-8 rounded-2xl border-2 border-accent-blue/20 hover:border-accent-blue/40 shadow-lg hover:shadow-xl transition-all">
              <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-accent-blue to-accent-blue/60 rounded-xl opacity-20 group-hover:opacity-30 transition" />
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-sm font-medium text-accent-blue bg-pastel-blue/50 rounded-full border border-accent-blue/30">
                Time map
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                What you covered vs what you planned
              </h3>
              <p className="text-slate-600 mb-6">
                You'd track pacing perfectly if you could. ClassPal shows minute-by-minute what took too long, what got skipped, and why.
              </p>
              <div className="bg-pastel-blue/30 rounded-xl p-4 border border-accent-blue/20 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Limiting reagents</span>
                  <span className="font-medium text-accent-pink">+6 min over</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Lab setup</span>
                  <span className="font-medium text-green-600">-2 min under</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Fire drill</span>
                  <span className="font-medium text-slate-400">5 min (unplanned)</span>
                </div>
              </div>
            </div>

            {/* 3. Where I Left Off */}
            <div className="group relative bg-white p-8 rounded-2xl border-2 border-accent-purple/20 hover:border-accent-purple/40 shadow-lg hover:shadow-xl transition-all">
              <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-accent-purple to-accent-purple/60 rounded-xl opacity-20 group-hover:opacity-30 transition" />
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-sm font-medium text-accent-purple bg-pastel-purple/50 rounded-full border border-accent-purple/30">
                Where I left off
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Progress across all your sections
              </h3>
              <p className="text-slate-600 mb-6">
                Teaching three AP Bio? You'd track each section perfectly if you could remember. ClassPal remembers for you.
              </p>
              <div className="bg-pastel-purple/30 rounded-xl p-4 border border-accent-purple/20 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-900 font-medium">Period 3</span>
                  <span className="text-accent-purple">Finished 4.2 ✓</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-900 font-medium">Period 5</span>
                  <span className="text-slate-600">Mid-4.1</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-900 font-medium">Period 7</span>
                  <span className="text-amber-600">Behind - needs reteach</span>
                </div>
              </div>
            </div>

            {/* 4. Summary & Recap */}
            <div className="group relative bg-white p-8 rounded-2xl border-2 border-accent-yellow/20 hover:border-accent-yellow/40 shadow-lg hover:shadow-xl transition-all">
              <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-accent-yellow to-accent-yellow/60 rounded-xl opacity-20 group-hover:opacity-30 transition" />
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-sm font-medium text-accent-yellow bg-pastel-yellow/50 rounded-full border border-accent-yellow/30">
                Summary & recap
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                What you actually taught today
              </h3>
              <p className="text-slate-600 mb-6">
                You'd write a recap for students and parents if you had time. ClassPal writes it based on what actually happened (not your plan).
              </p>
              <div className="bg-pastel-yellow/30 rounded-xl p-4 border border-accent-yellow/20 text-xs space-y-2">
                <div><span className="font-medium text-slate-900">Covered:</span> Limiting reagents, stoichiometry</div>
                <div><span className="font-medium text-slate-900">Objectives met:</span> 4.2 (calculate limiting reagent)</div>
                <div><span className="font-medium text-slate-900">Review:</span> Textbook p.142-145</div>
              </div>
            </div>
          </div>


          {/* Action Items from Insights */}
          <div className="mb-32">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                Plus the tools to act on what you learned
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                You know what to do with this information. ClassPal just makes it faster—so you can focus on the teaching part, not the admin part.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Action 1 - Reteach */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition">
                <div className="w-12 h-12 bg-gradient-to-br from-accent-blue to-accent-blue/60 rounded-xl mb-4 flex items-center justify-center text-white font-bold text-xl shadow-md">
                  1
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">10-min reteach plan</h4>
                <p className="text-sm text-slate-600 mb-3">
                  Targeted mini-lesson for tomorrow based on confusion moments. Two options, specific to what students missed.
                </p>
                <div className="text-xs text-slate-500 bg-pastel-blue px-2 py-1 rounded inline-block">
                  Saves 20-30 min per reteach
                </div>
              </div>

              {/* Action 2 - Exit ticket */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition">
                <div className="w-12 h-12 bg-gradient-to-br from-accent-pink to-accent-pink/60 rounded-xl mb-4 flex items-center justify-center text-white font-bold text-xl shadow-md">
                  2
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Exit ticket</h4>
                <p className="text-sm text-slate-600 mb-3">
                  5 questions aligned to what you actually taught. Answer key + misconception mapping. AP/IB exam-style.
                </p>
                <div className="text-xs text-slate-500 bg-pastel-pink px-2 py-1 rounded inline-block">
                  Ready in seconds
                </div>
              </div>

              {/* Action 3 - Coaching */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition">
                <div className="w-12 h-12 bg-gradient-to-br from-accent-yellow to-accent-yellow/60 rounded-xl mb-4 flex items-center justify-center text-white font-bold text-xl shadow-md">
                  3
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Coaching insight</h4>
                <p className="text-sm text-slate-600 mb-3">
                  One bite-sized insight per lesson (opt-in). Glow + grow, evidence-based, cites timestamps. Never judgment.
                </p>
                <div className="text-xs text-slate-500 bg-pastel-yellow px-2 py-1 rounded inline-block">
                  Always kind, always actionable
                </div>
              </div>

              {/* Action 4 - Assignment estimator */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition">
                <div className="w-12 h-12 bg-gradient-to-br from-accent-purple to-accent-purple/60 rounded-xl mb-4 flex items-center justify-center text-white font-bold text-xl shadow-md">
                  4
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Assignment time estimator</h4>
                <p className="text-sm text-slate-600 mb-3">
                  Estimate how long homework takes students (p25/p50/p75). Avoid workload overload across classes.
                </p>
                <div className="text-xs text-slate-500 bg-pastel-purple px-2 py-1 rounded inline-block">
                  Student workload guardrails
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* How it works */}
      <section className="py-20 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              Your copilot, not your replacement
            </h2>
            <p className="text-xl text-slate-600">
              You make the decisions. ClassPal handles the busy work.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-blue to-accent-purple rounded-2xl mx-auto mb-6 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Teach your class</h3>
              <p className="text-slate-600">
                ClassPal observes in the background. You focus on teaching.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-purple to-accent-pink rounded-2xl mx-auto mb-6 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Review the insights</h3>
              <p className="text-slate-600">
                See what confused students, where each section is, what you covered. You decide what to do next.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-pink to-accent-yellow rounded-2xl mx-auto mb-6 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Use what works</h3>
              <p className="text-slate-600">
                Edit the reteach plan, tweak the exit ticket, share the recap. You're in control.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Additional features */}
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              And so much more
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              ClassPal includes everything you need to understand and improve your teaching.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 hover:border-accent-blue/30 hover:shadow-md transition">
              <h4 className="font-semibold text-slate-900 mb-2 text-lg">Auto-generated homework</h4>
              <p className="text-sm text-slate-600">AP/IB-aligned questions created from your lesson in seconds. Standards-aligned, exam-style.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 hover:border-accent-blue/30 hover:shadow-md transition">
              <h4 className="font-semibold text-slate-900 mb-2 text-lg">Talk ratio analytics</h4>
              <p className="text-sm text-slate-600">Track teacher vs student talk time over time. Boost engagement with data.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 hover:border-accent-blue/30 hover:shadow-md transition">
              <h4 className="font-semibold text-slate-900 mb-2 text-lg">Pacing vs plan</h4>
              <p className="text-sm text-slate-600">See if you're ahead or behind your lesson plan—and why.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 hover:border-accent-blue/30 hover:shadow-md transition">
              <h4 className="font-semibold text-slate-900 mb-2 text-lg">Objective tracker</h4>
              <p className="text-sm text-slate-600">Track which objectives you've met, which need reteaching, per section.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 hover:border-accent-blue/30 hover:shadow-md transition">
              <h4 className="font-semibold text-slate-900 mb-2 text-lg">Teacher improvement trends</h4>
              <p className="text-sm text-slate-600">See how your teaching improves over time—pacing, clarity, student engagement.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 hover:border-accent-blue/30 hover:shadow-md transition">
              <h4 className="font-semibold text-slate-900 mb-2 text-lg">PD export (teacher-owned)</h4>
              <p className="text-sm text-slate-600">Export data for professional development—no admin access by default.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-20 sm:py-24 bg-gradient-to-b from-pastel-blue/20 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              Built for your daily teaching
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-2xl border border-slate-200">
              <div className="w-12 h-12 bg-pastel-blue rounded-xl mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">AP/IB Science</h3>
              <p className="text-slate-600 mb-4">
                Labs, inquiry activities, complex concepts. Get targeted reteach for stoichiometry, equilibrium, or cellular respiration.
              </p>
              <div className="text-sm text-slate-500">AP Bio • AP Chem • IB Physics</div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200">
              <div className="w-12 h-12 bg-pastel-pink rounded-xl mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-accent-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Social Studies & Humanities</h3>
              <p className="text-slate-600 mb-4">
                Discussion-heavy classes. Track talk ratio, capture student insights, generate document-based questions.
              </p>
              <div className="text-sm text-slate-500">AP History • IB Global Politics</div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200">
              <div className="w-12 h-12 bg-pastel-purple rounded-xl mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Math & Problem Solving</h3>
              <p className="text-slate-600 mb-4">
                Multi-step problems, common mistakes. Exit tickets with worked solutions, reteach targeting specific steps.
              </p>
              <div className="text-sm text-slate-500">AP Calc • IB Math AA/AI</div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200">
              <div className="w-12 h-12 bg-pastel-yellow rounded-xl mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-accent-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Teach Multiple Sections</h3>
              <p className="text-slate-600 mb-4">
                Three AP Bio classes? Track where you are in each, which objectives you've met, and what needs reteaching per section.
              </p>
              <div className="text-sm text-slate-500">Perfect for block schedules</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial / Quote */}
      <section className="py-20 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-slate-50 to-white p-12 rounded-3xl border border-slate-200 shadow-sm">
            <blockquote className="text-2xl sm:text-3xl font-medium text-slate-900 mb-6 leading-relaxed">
              "I know what my students need. I just don't have time to create it all—the exit tickets, the targeted reteach plans, tracking every section. This gives me that time back."
            </blockquote>
            <div className="text-slate-600 font-medium">AP Biology Teacher</div>
            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="text-lg text-slate-600">
                <span className="font-semibold text-slate-900">ClassPal handles the legwork.</span> You handle the teaching.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-20 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Built on principles that matter
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-2">Teacher-owned</h4>
              <p className="text-sm text-slate-600">No admin dashboards. Nothing shared without your permission.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-2">Not surveillance</h4>
              <p className="text-sm text-slate-600">Your assistant, not your evaluator.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-2">Action in 60 seconds</h4>
              <p className="text-sm text-slate-600">Outputs you can use immediately.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-2">Specific to your class</h4>
              <p className="text-sm text-slate-600">Cites your objectives, textbook, timestamps.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-2">AP/IB fidelity</h4>
              <p className="text-sm text-slate-600">Exam-style rigor and pacing realism.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-2">Coaching that's kind</h4>
              <p className="text-sm text-slate-600">Opt-in, glow + grow, always actionable.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="waitlist" className="py-24 sm:py-32 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Get your copilot for free
          </h2>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
            Join AP and IB teachers using ClassPal to do what they already do best—just faster.
          </p>

          <form onSubmit={handleWaitlistSubmit} className="max-w-md mx-auto space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              required
              className="w-full px-5 py-4 rounded-xl border-2 border-slate-700 bg-slate-800/50 text-white placeholder:text-slate-400 focus:border-accent-blue focus:outline-none focus:ring-2 focus:ring-accent-blue/20 transition text-lg"
            />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (optional)"
              className="w-full px-5 py-4 rounded-xl border-2 border-slate-700 bg-slate-800/50 text-white placeholder:text-slate-400 focus:border-accent-blue focus:outline-none focus:ring-2 focus:ring-accent-blue/20 transition text-lg"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg hover:shadow-xl text-lg"
            >
              {isSubmitting ? 'Joining…' : 'Get ClassPal for free'}
            </button>
          </form>

          {submitStatus === 'success' && (
            <p className="mt-6 text-green-400 font-medium text-lg">You're on the list. We'll be in touch.</p>
          )}
          {submitStatus && submitStatus !== 'success' && (
            <p className="mt-6 text-red-400">{submitStatus}</p>
          )}

          <p className="mt-8 text-sm text-slate-400">
            No spam. No sales emails. Just an invite when ClassPal is ready.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-accent-blue to-accent-purple rounded-lg" />
              <span className="font-bold text-xl text-slate-900">ClassPal</span>
            </div>
            <p className="text-slate-500 text-center max-w-md">
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
