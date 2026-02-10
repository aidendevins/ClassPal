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
              <span className="hidden sm:flex text-xs text-slate-400 items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Online
              </span>
            )}
            <a
              href="#waitlist"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition"
            >
              Get ClassPal for free
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-pastel-blue/20 to-white pt-12 pb-20 sm:pt-20 sm:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 mb-6 leading-[1.05] tracking-tight">
              One class is worth a thousand insights
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              Turn every class into actionable next steps with AI-powered outputs that save you hours and help students master the material
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <a
                href="#waitlist"
                className="px-8 py-4 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition shadow-lg hover:shadow-xl"
              >
                Get ClassPal for free
              </a>
              <span className="text-sm text-slate-500">For AP & IB teachers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-slate-50 border-y border-slate-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-slate-600">
            Designed with AP Biology, AP Chemistry, IB Math, and IB History teachers
          </p>
        </div>
      </section>

      {/* The easiest copilot */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              The easiest teaching copilot you'll ever use
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Teach your class. Get targeted outputs. Use them tomorrow. Specific to your objectives, your textbook, your students.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-pastel-blue to-accent-blue/30 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <svg className="w-10 h-10 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Automatic capture</h3>
              <p className="text-slate-600 leading-relaxed">
                ClassPal captures your class in the background. No setup, no buttons, no interruption.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-pastel-purple to-accent-purple/30 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <svg className="w-10 h-10 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Lightning-fast outputs</h3>
              <p className="text-slate-600 leading-relaxed">
                After class, get reteach plans, exit tickets, student recaps, and coaching—in under 60 seconds.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-pastel-pink to-accent-pink/30 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <svg className="w-10 h-10 text-accent-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Ready to use</h3>
              <p className="text-slate-600 leading-relaxed">
                Every output cites your objectives, textbook pages, timestamps, and student questions. Specific to YOUR class.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Daily outputs */}
      <section className="py-20 sm:py-28 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              After every class, you get what you need
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Not generic AI outputs. Classroom-ready materials specific to what you taught, aligned to your curriculum, citing your textbook.
            </p>
          </div>

          <div className="space-y-12 max-w-6xl mx-auto">
            {/* Output 1 */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm hover:shadow-md transition">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-semibold text-accent-blue bg-pastel-blue rounded-full">
                    Most used
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4">Targeted 10-minute reteach</h3>
                  <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                    Not "restart the whole concept." A mini-lesson for tomorrow—two options, block-schedule aware, grounded in what actually confused students. Cites objectives, timestamps, and student questions.
                  </p>
                  <div className="space-y-2 text-sm text-slate-600">
                    <p className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-accent-blue mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Saves 20-30 minutes of class time per reteach</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-accent-blue mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Pinpoints exact sticking point (e.g., "5 students confused stoichiometry → mole ratio, specifically")</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-accent-blue mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Includes worked example + 2 practice problems, ready to use</span>
                    </p>
                  </div>
                </div>
                <div className="w-full md:w-80 bg-gradient-to-br from-pastel-blue to-pastel-purple rounded-2xl p-6 text-sm">
                  <div className="font-mono text-xs text-slate-500 mb-2">Example output:</div>
                  <div className="text-slate-700 space-y-2">
                    <p className="font-semibold">Reteach: Limiting Reagents (10 min)</p>
                    <p className="text-xs">5 students confused at 23:15 when balancing mole ratios.</p>
                    <p className="text-xs mt-2"><strong>Mini-lesson:</strong> "Let's revisit the sandwich analogy. If you have 10 slices of bread but only 3 pieces of cheese..."</p>
                    <p className="text-xs text-accent-purple mt-2">→ Cites textbook Ch. 12.3, your objectives</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Output 2 */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm hover:shadow-md transition">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-semibold text-accent-pink bg-pastel-pink rounded-full">
                    Daily driver
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4">Exit ticket that actually runs</h3>
                  <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                    5 questions aligned to what you taught today (not generic textbook questions). Comes with answer key + misconception mapping. Real-time or next-day warmup.
                  </p>
                  <div className="space-y-2 text-sm text-slate-600">
                    <p className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-accent-pink mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>AP/IB exam-style rigor, aligned to standards</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-accent-pink mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Misconception mapping: "If they get #3 wrong, they likely confused X with Y"</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-accent-pink mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Saves 10-15 min creating + 15 min grading = 25 min per day</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Output 3 */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm hover:shadow-md transition">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-slate-900 mb-4">Top 3 confusion moments (with fixes)</h3>
                  <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                    Pinpoints exactly where students got lost. Includes timestamps, student questions, and suggested clarifying explanations you can use tomorrow.
                  </p>
                  <div className="space-y-2 text-sm text-slate-600">
                    <p className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-accent-purple mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Example: "Students confused at 32:00-35:00 during balancing equations. Multiple asked about subscripts vs coefficients."</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-accent-purple mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Includes suggested clarification using your terminology</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Output 4 */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm hover:shadow-md transition">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-slate-900 mb-4">Student recap, ready to share</h3>
                  <p className="text-lg text-slate-600 mb-4 leading-relaxed">
                    Key objectives, vocab, what to study, 3 practice prompts, textbook page refs. Send to students in one click.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All powerful features */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Everything you need to teach effectively
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              ClassPal is more than outputs. It's your daily teaching assistant.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:border-accent-blue transition">
              <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="text-accent-blue">●</span>
                Lesson summary + objectives
              </h4>
              <p className="text-sm text-slate-600">Teacher version and student-facing recap. Cites your textbook chapters and objectives.</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:border-accent-blue transition">
              <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="text-accent-blue">●</span>
                Time map of your lesson
              </h4>
              <p className="text-sm text-slate-600">Minutes per topic + off-track segments. See where you went over and adjust pacing.</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:border-accent-blue transition">
              <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="text-accent-blue">●</span>
                Exit tickets + answer keys
              </h4>
              <p className="text-sm text-slate-600">5 questions aligned to what you taught. Misconception mapping included.</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:border-accent-blue transition">
              <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="text-accent-blue">●</span>
                Targeted reteach plans
              </h4>
              <p className="text-sm text-slate-600">10-minute mini-lessons with two options. Block-schedule aware.</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:border-accent-blue transition">
              <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="text-accent-blue">●</span>
                Confusion moment analysis
              </h4>
              <p className="text-sm text-slate-600">Top 3 moments where students got lost, with clarifying explanations.</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:border-accent-blue transition">
              <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="text-accent-blue">●</span>
                One coaching insight (opt-in)
              </h4>
              <p className="text-sm text-slate-600">Glow + grow. Evidence-based, kind, concrete fix. One per lesson.</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:border-accent-blue transition">
              <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="text-accent-blue">●</span>
                Auto-generated homework/quizzes
              </h4>
              <p className="text-sm text-slate-600">Aligned to AP/IB standards. Mix of question types, tiered difficulty.</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:border-accent-blue transition">
              <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="text-accent-blue">●</span>
                Talk ratio analytics
              </h4>
              <p className="text-sm text-slate-600">Teacher vs student talk. See participation distribution over time.</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:border-accent-blue transition">
              <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="text-accent-blue">●</span>
                Assignment time estimator
              </h4>
              <p className="text-sm text-slate-600">Estimates how long assignments will take (p25/p50/p75). Prevents student overload.</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:border-accent-blue transition">
              <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="text-accent-blue">●</span>
                "Where did I leave off?"
              </h4>
              <p className="text-sm text-slate-600">Track lesson prep, grading, reteach status, objectives across duplicate courses.</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:border-accent-blue transition">
              <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="text-accent-blue">●</span>
                PD/admin reports (teacher-owned)
              </h4>
              <p className="text-sm text-slate-600">Export evidence of teaching for evaluations. You control what's shared.</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:border-accent-blue transition">
              <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="text-accent-blue">●</span>
                Student recaps
              </h4>
              <p className="text-sm text-slate-600">One-page study guide with vocab, practice prompts, textbook refs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-20 sm:py-28 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Teaching aids for all scenarios
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-2xl border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-3">When a lesson doesn't land</h3>
              <p className="text-slate-600 mb-4">
                See exactly where students got confused. Get a targeted reteach plan for tomorrow instead of burning half the class restarting from scratch.
              </p>
              <div className="text-sm text-accent-blue font-medium">→ Saves 20-30 minutes of class time</div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Daily formative assessment</h3>
              <p className="text-slate-600 mb-4">
                Generate exit tickets in seconds. Know what to review tomorrow before students forget. Consistent feedback loop without the operational hassle.
              </p>
              <div className="text-sm text-accent-blue font-medium">→ Used by teachers every single day</div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Pacing under pressure</h3>
              <p className="text-slate-600 mb-4">
                See your time map: minutes per topic, where you went off-track. Adjust pacing to cover all AP/IB units before exams without sacrificing depth.
              </p>
              <div className="text-sm text-accent-blue font-medium">→ Critical for AP/IB teachers</div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Teaching multiple sections</h3>
              <p className="text-slate-600 mb-4">
                "Where did I leave off?" tracks lesson prep, grading status, and objectives across duplicate courses. Never lose track of which class is where.
              </p>
              <div className="text-sm text-accent-blue font-medium">→ Especially useful for 3+ sections</div>
            </div>
          </div>
        </div>
      </section>

      {/* Specific to your class */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-pastel-yellow/30 via-white to-pastel-blue/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              Every output is specific to YOUR class
            </h2>
            <p className="text-xl text-slate-600 mb-12 leading-relaxed">
              Not generic AI outputs. ClassPal cites your objectives, your textbook pages, your students' questions, your teaching style. It feels like an assistant who was sitting in your classroom.
            </p>
            <div className="grid sm:grid-cols-2 gap-6 text-left">
              <div className="bg-white/80 backdrop-blur p-6 rounded-xl border border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-2">References your curriculum</h4>
                <p className="text-sm text-slate-600">Outputs mention "AP Calculus Unit 5.3" or "IB Chem Topic 7: Equilibrium" by name, tied to your syllabus.</p>
              </div>
              <div className="bg-white/80 backdrop-blur p-6 rounded-xl border border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-2">Cites textbook pages</h4>
                <p className="text-sm text-slate-600">Student recaps include "Review Ch. 12.3, p.245-247" because we know your textbook.</p>
              </div>
              <div className="bg-white/80 backdrop-blur p-6 rounded-xl border border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-2">Uses your examples</h4>
                <p className="text-sm text-slate-600">If you made a "sandwich analogy" for limiting reagents, the reteach plan references it.</p>
              </div>
              <div className="bg-white/80 backdrop-blur p-6 rounded-xl border border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-2">Quotes student questions</h4>
                <p className="text-sm text-slate-600">Confusion moments cite actual questions: "A student asked, 'Do plants respirate at night too?'"</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Built on principles that matter
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-2">Teacher-first, teacher-owned</h4>
              <p className="text-sm text-slate-600">No admin dashboards by default. Nothing shared without your explicit action.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-2">Not surveillance</h4>
              <p className="text-sm text-slate-600">Your assistant, not your evaluator. All data stays with you.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-2">Action in under 60 seconds</h4>
              <p className="text-sm text-slate-600">Outputs you can use immediately. No dashboards, no analysis paralysis.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-2">Specific to your class</h4>
              <p className="text-sm text-slate-600">Cites your objectives, textbook refs, timestamps, student questions.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-2">AP/IB fidelity</h4>
              <p className="text-sm text-slate-600">Exam-style rigor, long-answer support, pacing realism.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-2">Coaching that's kind</h4>
              <p className="text-sm text-slate-600">Opt-in, bite-sized, glow + grow. One insight, always actionable.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist CTA */}
      <section id="waitlist" className="py-20 sm:py-32 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/10 via-transparent to-accent-purple/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Get ClassPal for free
            </h2>
            <p className="text-lg text-slate-300 mb-8">
              Join AP and IB teachers testing ClassPal. We'll reach out when we're ready for you.
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
                {isSubmitting ? 'Joining…' : 'Get ClassPal for free'}
              </button>
            </form>

            {submitStatus === 'success' && (
              <p className="mt-4 text-green-400 font-medium">You're on the list. We'll be in touch soon.</p>
            )}
            {submitStatus && submitStatus !== 'success' && (
              <p className="mt-4 text-red-400 text-sm">{submitStatus}</p>
            )}

            <p className="mt-6 text-sm text-slate-400">
              No spam. Teacher-first means we'll only reach out when ClassPal is ready.
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
