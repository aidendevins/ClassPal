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
            See your class.
            <br />
            <span className="bg-gradient-to-r from-accent-blue via-accent-purple to-accent-pink bg-clip-text text-transparent">
              Improve your class.
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto">
            Know exactly what you covered, what took too long, what confused students, and where to pick up tomorrow—with a minute-by-minute time map of every class.
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
            Designed with feedback from AP Biology, AP Chemistry, and IB teachers
          </p>
        </div>
      </section>

      {/* Main Problem */}
      <section className="py-20 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            "Did we finish that?"
            <br />
            <span className="text-slate-600">"Why are we so behind in Period 3?"</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            You teach, but you don't know exactly what happened—what took too long, where students got lost, or where each section left off. So you guess.
          </p>
        </div>
      </section>

      {/* Main feature - Time Map as core */}
      <section className="py-20 sm:py-32 bg-gradient-to-b from-white via-pastel-blue/20 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              The black box of your classroom—opened
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              A minute-by-minute time map shows what actually happened in your class.
            </p>
          </div>

          {/* Hero Feature - Time Map */}
          <div className="mb-32">
            <div className="bg-gradient-to-br from-pastel-blue to-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-2xl max-w-5xl mx-auto">
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Period 3 • AP Chemistry</div>
                    <div className="text-lg font-bold text-slate-900">Today's Time Map</div>
                  </div>
                  <div className="text-sm text-slate-600">
                    <span className="font-semibold">45 min</span> class
                  </div>
                </div>
                
                <div className="space-y-4">
                  {/* Time block 1 */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-20 text-sm font-medium text-slate-600">0:00–5:00</div>
                    <div className="flex-1 bg-pastel-yellow rounded-lg p-4 border border-slate-200">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-semibold text-slate-900">Warmup & Review</div>
                        <div className="text-xs text-slate-500">5 min</div>
                      </div>
                      <div className="text-sm text-slate-600">Homework questions</div>
                    </div>
                  </div>

                  {/* Time block 2 - Over time */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-20 text-sm font-medium text-slate-600">5:00–23:00</div>
                    <div className="flex-1 bg-pastel-pink rounded-lg p-4 border-2 border-accent-pink/30">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-semibold text-slate-900 flex items-center gap-2">
                          Limiting Reagents
                          <span className="text-xs bg-accent-pink/20 text-accent-pink px-2 py-0.5 rounded-full font-medium">6 min over</span>
                        </div>
                        <div className="text-xs text-slate-500">18 min (planned 12)</div>
                      </div>
                      <div className="text-sm text-slate-600 mb-2">Objective 4.2 • Textbook p.142-145</div>
                      <div className="text-sm bg-white/70 rounded px-3 py-2 border border-accent-pink/20">
                        <span className="font-medium text-accent-pink">⚠️ Confusion spike at 18:15</span> — 8 students asked about mole ratios
                      </div>
                    </div>
                  </div>

                  {/* Time block 3 */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-20 text-sm font-medium text-slate-600">23:00–31:00</div>
                    <div className="flex-1 bg-pastel-purple rounded-lg p-4 border border-slate-200">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-semibold text-slate-900">Lab Setup & Demo</div>
                        <div className="text-xs text-slate-500">8 min</div>
                      </div>
                      <div className="text-sm text-slate-600">Stoichiometry lab prep</div>
                    </div>
                  </div>

                  {/* Time block 4 - Off track */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-20 text-sm font-medium text-slate-600">31:00–36:00</div>
                    <div className="flex-1 bg-slate-100 rounded-lg p-4 border border-slate-300">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-semibold text-slate-600 flex items-center gap-2">
                          Off-track
                          <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-medium">Unplanned</span>
                        </div>
                        <div className="text-xs text-slate-500">5 min</div>
                      </div>
                      <div className="text-sm text-slate-600">Fire drill</div>
                    </div>
                  </div>

                  {/* Time block 5 */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-20 text-sm font-medium text-slate-600">36:00–45:00</div>
                    <div className="flex-1 bg-pastel-blue rounded-lg p-4 border border-slate-200">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-semibold text-slate-900">Group Practice</div>
                        <div className="text-xs text-slate-500">9 min</div>
                      </div>
                      <div className="text-sm text-slate-600">Practice problems 1-4</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-slate-900">75%</div>
                    <div className="text-xs text-slate-500">On planned topics</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent-pink">+6 min</div>
                    <div className="text-xs text-slate-500">Over planned time</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent-blue">1</div>
                    <div className="text-xs text-slate-500">Confusion moment</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-4xl mx-auto mt-12 text-center">
              <p className="text-lg text-slate-600 leading-relaxed">
                <span className="font-semibold text-slate-900">Never wonder "did we finish that?" again.</span> See exactly what you covered, what took too long, where students got confused, and where to start tomorrow.
              </p>
            </div>
          </div>

          {/* Three Key Insights from Time Map */}
          <div className="space-y-24 mb-32">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                From your time map, you get three key insights
              </h2>
              <p className="text-lg text-slate-600">
                Know exactly what happened—so you can act on it tomorrow.
              </p>
            </div>

            {/* Insight 1 - Confusion moments */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-sm font-medium text-accent-pink bg-pastel-pink rounded-full">
                  Confusion moments
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">
                  See exactly where students got lost
                </h3>
                <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                  Top 3 confusion moments with timestamps, clarifying explanations, and how many students were affected. Stop guessing what to reteach.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-accent-pink flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-700">Pinpoints exact moments students got confused</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-accent-pink flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-700">Shows student questions and misconceptions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-accent-pink flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-700">Suggests clarifying explanations</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-pastel-pink to-white p-8 rounded-2xl border border-slate-200 shadow-xl">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Top 3 Confusion Moments</div>
                  <div className="space-y-4">
                    <div className="p-4 bg-pastel-pink/30 rounded-lg border border-accent-pink/20">
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-semibold text-slate-900">Mole ratio calculation</div>
                        <div className="text-xs text-slate-500">18:15</div>
                      </div>
                      <div className="text-sm text-slate-600 mb-2">8 students asked variants of "how do we know which coefficient to use?"</div>
                      <div className="text-xs text-accent-pink font-medium">💡 Suggested clarification: Coefficients come from the balanced equation...</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-semibold text-slate-900">Excess vs limiting reagent</div>
                        <div className="text-xs text-slate-500">21:30</div>
                      </div>
                      <div className="text-sm text-slate-600">3 students confused terminology</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-semibold text-slate-900">Unit conversion</div>
                        <div className="text-xs text-slate-500">38:45</div>
                      </div>
                      <div className="text-sm text-slate-600">2 students mixing up grams and moles</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Insight 2 - Where I left off */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="lg:order-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-sm font-medium text-accent-purple bg-pastel-purple rounded-full">
                  Where I left off
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">
                  Track progress across all sections
                </h3>
                <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                  Teaching three AP Bio classes? Know exactly where each section is—which objectives you've met, what needs reteaching, and where to start tomorrow.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-accent-purple flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-700">Perfect for teaching duplicate courses</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-accent-purple flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-700">Tracks objective completion per section</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-accent-purple flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-700">Never wonder "where did we leave off?"</span>
                  </li>
                </ul>
              </div>
              <div className="lg:order-1 bg-gradient-to-br from-pastel-purple to-white p-8 rounded-2xl border border-slate-200 shadow-xl">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">AP Chemistry Progress</div>
                  <div className="space-y-4">
                    <div className="p-4 bg-pastel-purple/30 rounded-lg border border-accent-purple/20">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-slate-900">Period 3</div>
                        <div className="text-xs bg-accent-purple/20 text-accent-purple px-2 py-1 rounded-full font-medium">Ahead</div>
                      </div>
                      <div className="text-sm text-slate-600 mb-2">Finished 4.2 • Ready for 4.3 tomorrow</div>
                      <div className="text-xs text-slate-500">Last class: Limiting reagents lab</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-slate-900">Period 5</div>
                        <div className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-full font-medium">On track</div>
                      </div>
                      <div className="text-sm text-slate-600 mb-2">Finished 4.1 • Start 4.2 tomorrow</div>
                      <div className="text-xs text-slate-500">Last class: Stoichiometry intro</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-slate-900">Period 7</div>
                        <div className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">Behind</div>
                      </div>
                      <div className="text-sm text-slate-600 mb-2">Mid-4.1 • Reteach mole ratios, then continue</div>
                      <div className="text-xs text-slate-500">Last class: Mole concept review</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Insight 3 - Summary & Recap */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-sm font-medium text-accent-blue bg-pastel-blue rounded-full">
                  Summary & recap
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">
                  What you actually covered—not what you planned
                </h3>
                <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                  A summary of what happened in class, aligned to what you actually taught (not your lesson plan). Perfect for absent students, parent communication, or starting tomorrow's class.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-accent-blue flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-700">Reflects what actually happened, not the plan</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-accent-blue flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-700">Share with students or parents in one click</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-accent-blue flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-700">Helps absent students catch up quickly</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-pastel-blue to-white p-8 rounded-2xl border border-slate-200 shadow-xl">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Today's Class Summary</div>
                  <div className="space-y-4 text-sm">
                    <div>
                      <div className="font-semibold text-slate-900 mb-2">What we covered</div>
                      <div className="text-slate-600 leading-relaxed">
                        Limiting reagents and excess reagents in chemical reactions. We worked through the mole ratio method and practiced with example problems.
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 mb-1">Objectives met</div>
                      <div className="text-slate-600">• Calculate limiting reagent (4.2)<br />• Explain stoichiometry with mole ratios (4.2)</div>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 mb-1">Key vocab</div>
                      <div className="text-slate-600">Limiting reagent, excess reagent, mole ratio, stoichiometry</div>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 mb-1">For next class</div>
                      <div className="text-slate-600">Review textbook p.142-145 • Practice problems 3-7</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Items from Insights */}
          <div className="mb-32">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                Then you get classroom-ready action items
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Because insights are useless without tools. ClassPal turns what happened into what to do next.
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
              Stop guessing. Start knowing.
            </h2>
            <p className="text-xl text-slate-600">
              See what happened. Act on it tomorrow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-blue to-accent-purple rounded-2xl mx-auto mb-6 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Teach your class</h3>
              <p className="text-slate-600">
                ClassPal runs in the background. No setup, no interruption.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-purple to-accent-pink rounded-2xl mx-auto mb-6 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">See your time map</h3>
              <p className="text-slate-600">
                Minute-by-minute breakdown. Confusion moments. Where you left off. What actually happened.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-pink to-accent-yellow rounded-2xl mx-auto mb-6 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Use the tools</h3>
              <p className="text-slate-600">
                Reteach plan, exit ticket, student recap, coaching insight—ready instantly.
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
              "I teach three sections of AP Bio. I never know if Period 3 is ahead or Period 5 is behind. I just guess and hope."
            </blockquote>
            <div className="text-slate-600 font-medium">AP Biology Teacher</div>
            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="text-lg text-slate-600">
                <span className="font-semibold text-slate-900">ClassPal shows you exactly where each section is.</span> No more guessing.
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
            Get early access to ClassPal
          </h2>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
            Join AP and IB teachers testing ClassPal. We'll be in touch when we're ready.
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
