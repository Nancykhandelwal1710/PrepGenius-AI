import { Link } from "react-router-dom";

const tools = [
  {
    icon: "🎤",
    title: "Practice Interview",
    text: "Get real interview questions and useful feedback on every answer.",
    to: "/mock-interview",
    accent: "bg-[#EEF0FF]",
    iconBg: "bg-[#2457D6]",
    action: "Start practicing",
  },
  {
    icon: "📄",
    title: "Analyze Resume",
    text: "Compare your resume with a job description and find what's missing.",
    to: "/resume-analyzer",
    accent: "bg-[#FFF1EC]",
    iconBg: "bg-[#FF6B57]",
    action: "Analyze now",
  },
  {
    icon: "✦",
    title: "Optimize Resume",
    text: "Improve your existing resume with targeted, job-focused suggestions.",
    to: "/resume-optimizer",
    accent: "bg-[#F5F8DD]",
    iconBg: "bg-[#B7D52B]",
    action: "Optimize now",
  },
  {
    icon: "✎",
    title: "Build Resume",
    text: "Create a professional resume from scratch without starting from zero.",
    to: "/resume-builder",
    accent: "bg-[#EDF5FF]",
    iconBg: "bg-[#2457D6]",
    action: "Build now",
  },
];

const steps = [
  {
    number: "01",
    title: "Know where you stand",
    text: "Analyze your resume against the role you actually want.",
  },
  {
    number: "02",
    title: "Fix the gaps",
    text: "Improve your resume and focus on the skills that matter.",
  },
  {
    number: "03",
    title: "Practice for real",
    text: "Take mock interviews and learn from every answer.",
  },
];

const features = [
  ["🎯", "Job-focused", "Prepare around a real target role instead of studying randomly."],
  ["🧠", "Useful feedback", "Understand what worked, what didn't, and what to do next."],
  ["🔥", "Keep your momentum", "Small practice sessions add up to real improvement."],
  ["🏆", "See your growth", "Track scores and progress as you become more confident."],
  ["⚡", "Everything together", "Resume analysis, optimization and interview practice in one place."],
  ["💬", "Made for people", "Clear language and helpful actions without a complicated interface."],
];

function Home() {
  return (
    <div className="min-h-screen bg-[#FBFAF6] text-[#14213D]">
      {/* Hero */}
      <main>
        <section className="relative overflow-hidden border-b border-[#14213D]/10 pt-4">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-[#B8E34B]/30" />
          <div className="absolute top-40 -left-28 h-72 w-72 rounded-full bg-[#BFD5FF]/35" />

          <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-20 lg:py-24">
            <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 text-sm font-semibold mb-7">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#FF6B57]" />
                  Career preparation, without the boring dashboard
                </div>

                <h1 className="text-[clamp(3.2rem,7vw,6.8rem)] leading-[0.9] tracking-[-0.065em] font-black max-w-3xl">
                  Your career prep,
                  <br />
                  <span className="font-serif italic font-normal text-[#2457D6]">
                    but actually fun.
                  </span>
                </h1>

                <div className="relative mt-7 max-w-xl">
                  <p className="text-lg md:text-xl leading-8 text-[#14213D]/70">
                    PrepGenius helps you analyze, improve and build resumes,
                    practice interviews and walk into opportunities with more confidence.
                  </p>
                  <div className="absolute -bottom-3 left-24 w-28 h-2 bg-[#B8E34B] -rotate-2 rounded-full" />
                </div>

                <div className="mt-10 flex flex-wrap gap-3">
                  <Link
                    to="/resume-analyzer"
                    className="inline-flex items-center gap-3 bg-[#2457D6] text-white px-6 py-3.5 rounded-xl font-bold shadow-[4px_4px_0_#14213D] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#14213D] transition-all"
                  >
                    Analyze Resume
                    <span>→</span>
                  </Link>

                  <Link
                    to="/resume-optimizer"
                    className="inline-flex items-center gap-3 bg-white border-2 border-[#14213D] px-6 py-3.5 rounded-xl font-bold hover:bg-[#14213D] hover:text-white transition-colors"
                  >
                    Optimize Resume
                    <span>✦</span>
                  </Link>

                  <Link
                    to="/resume-builder"
                    className="inline-flex items-center gap-3 bg-[#B8E34B] text-[#14213D] px-6 py-3.5 rounded-xl font-bold border-2 border-[#14213D] hover:bg-white transition-colors"
                  >
                    Build Resume
                    <span>↗</span>
                  </Link>

                  <Link
                    to="/mock-interview"
                    className="inline-flex items-center gap-3 bg-[#14213D] text-white px-6 py-3.5 rounded-xl font-bold hover:bg-[#2457D6] transition-colors"
                  >
                    Practice Interview
                    <span>🎤</span>
                  </Link>
                </div>

                <div className="mt-9 flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex -space-x-2">
                    {["👩🏻", "👨🏽", "👩🏾", "👨🏻"].map((person, index) => (
                      <span
                        key={index}
                        className="h-9 w-9 rounded-full bg-white border-2 border-[#FBFAF6] flex items-center justify-center text-lg shadow-sm"
                      >
                        {person}
                      </span>
                    ))}
                  </div>
                  <p>
                    <strong>Built for students & job seekers</strong>
                    <span className="text-[#14213D]/55"> who want to prepare smarter.</span>
                  </p>
                </div>
              </div>

              {/* Hand-built visual instead of a generic dashboard screenshot */}
              <div className="relative min-h-[480px]">
                <div className="absolute top-2 right-5 rotate-3 bg-[#B8E34B] px-5 py-4 shadow-[4px_4px_0_#14213D] max-w-[190px] z-20">
                  <p className="font-serif italic text-lg leading-5">
                    Small steps today,
                    <br />
                    big results tomorrow.
                  </p>
                  <span className="block text-right mt-2 text-xl">☺</span>
                </div>

                <div className="absolute top-28 right-0 md:right-6 w-44 bg-white border-2 border-[#14213D] px-5 py-5 rotate-2 shadow-[5px_5px_0_#14213D] z-10">
                  <p className="text-5xl font-black text-[#2457D6] tracking-tight">82%</p>
                  <p className="font-bold mt-1">Interview confidence</p>
                  <div className="mt-3 flex items-end gap-1 h-8">
                    {[35, 45, 42, 62, 58, 76, 90].map((height, i) => (
                      <span
                        key={i}
                        className={`flex-1 rounded-t-sm ${i === 6 ? "bg-[#FF6B57]" : "bg-[#2457D6]/20"}`}
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>

                <div className="absolute top-36 left-2 md:left-8 w-[78%] max-w-[430px] bg-[#2457D6] border-2 border-[#14213D] p-6 pt-8 shadow-[8px_8px_0_#14213D] rotate-[-2deg]">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 h-7 w-24 bg-[#FF6B57] rotate-[-2deg]" />

                  <div className="text-white/70 text-sm font-bold">TODAY'S PRACTICE</div>
                  <h2 className="mt-2 text-3xl md:text-4xl font-black tracking-tight text-white">
                    Tell me about a technical challenge you solved.
                  </h2>

                  <div className="mt-7 flex items-center justify-between">
                    <span className="text-white/70 text-sm">Question 2 of 5</span>
                    <span className="bg-[#B8E34B] text-[#14213D] px-3 py-1 rounded-full text-xs font-black">
                      MEDIUM
                    </span>
                  </div>

                  <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full w-2/5 bg-[#B8E34B] rounded-full" />
                  </div>

                  <Link
                    to="/mock-interview"
                    className="mt-7 inline-flex items-center gap-2 bg-white text-[#14213D] px-5 py-3 rounded-lg font-black hover:bg-[#B8E34B] transition-colors"
                  >
                    Continue <span>→</span>
                  </Link>
                </div>

                <div className="absolute bottom-8 right-3 md:right-8 bg-white border-2 border-[#14213D] px-5 py-4 -rotate-3 shadow-[5px_5px_0_#14213D]">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#14213D]/50">Streak</p>
                  <p className="text-2xl font-black">🔥 7 days</p>
                </div>

                <div className="absolute bottom-0 left-10 text-5xl rotate-12">↗</div>
                <div className="absolute top-24 left-0 text-4xl text-[#FF6B57] rotate-[-15deg]">✦</div>
                <div className="absolute bottom-20 right-0 text-3xl text-[#2457D6]">〰</div>
              </div>
            </div>
          </div>
        </section>

        {/* Tools */}
        <section id="tools" className="py-20 md:py-24 bg-white border-b border-[#14213D]/10">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
              <div>
                <p className="font-serif italic text-xl text-[#2457D6]">Pick your next move</p>
                <h2 className="mt-2 text-4xl md:text-5xl font-black tracking-[-0.04em]">
                  What do you want to work on today?
                </h2>
              </div>
              <p className="max-w-sm text-[#14213D]/60 leading-7">
                One goal. One useful action. No wandering around a complicated dashboard.
              </p>
            </div>

            <div className="mt-12 grid md:grid-cols-2 xl:grid-cols-4 gap-5">
              {tools.map((tool, index) => (
                <Link
                  key={tool.title}
                  to={tool.to}
                  className={`${tool.accent} group min-h-[270px] border-2 border-[#14213D]/10 p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform ${
                    index % 2 === 0 ? "rounded-[22px]" : "rounded-[8px]"
                  }`}
                >
                  <div>
                    <div className={`h-12 w-12 ${tool.iconBg} text-white flex items-center justify-center text-2xl rounded-xl shadow-[3px_3px_0_#14213D]`}>
                      {tool.icon}
                    </div>
                    <h3 className="mt-7 text-2xl font-black tracking-tight">{tool.title}</h3>
                    <p className="mt-3 text-[#14213D]/65 leading-7">{tool.text}</p>
                  </div>

                  <div className="mt-7 font-black text-[#2457D6] group-hover:translate-x-1 transition-transform">
                    {tool.action} →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-20 md:py-28 bg-[#FBFAF6]">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-14 items-start">
              <div className="lg:sticky lg:top-10">
                <p className="font-serif italic text-2xl text-[#FF6B57]">No secret formula.</p>
                <h2 className="mt-3 text-5xl md:text-6xl font-black leading-[0.95] tracking-[-0.05em]">
                  Just a better way to prepare.
                </h2>
                <p className="mt-6 text-[#14213D]/65 text-lg leading-8 max-w-md">
                  PrepGenius turns career preparation into a simple loop:
                  understand, improve, practice, repeat.
                </p>
              </div>

              <div className="space-y-5">
                {steps.map((step, index) => (
                  <div
                    key={step.number}
                    className={`grid sm:grid-cols-[90px_1fr] gap-5 items-start p-7 border-2 border-[#14213D]/10 bg-white ${
                      index === 1 ? "rotate-[0.5deg]" : index === 2 ? "rotate-[-0.5deg]" : ""
                    }`}
                  >
                    <div className="font-mono text-sm font-bold text-[#FF6B57]">
                      {step.number}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black">{step.title}</h3>
                      <p className="mt-2 text-[#14213D]/60 leading-7 max-w-xl">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Progress */}
        <section className="py-20 md:py-24 bg-[#EEF3FF] border-y border-[#14213D]/10">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="grid lg:grid-cols-[0.7fr_1.3fr] gap-10 items-center">
              <div>
                <p className="font-serif italic text-2xl text-[#2457D6]">Track progress.</p>
                <h2 className="mt-2 text-5xl md:text-6xl font-black leading-[0.95] tracking-[-0.05em]">
                  See yourself get better.
                </h2>
                <p className="mt-6 text-[#14213D]/65 text-lg leading-8">
                  Consistency today. Better answers tomorrow.
                </p>
                <Link
                  to="/dashboard"
                  className="inline-flex mt-7 bg-[#14213D] text-white px-6 py-3.5 rounded-xl font-bold hover:bg-[#2457D6] transition-colors"
                >
                  Go to dashboard →
                </Link>
              </div>

              <div className="bg-white border-2 border-[#14213D] p-6 md:p-8 shadow-[8px_8px_0_#2457D6]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-[#14213D]/50">YOUR PROGRESS</p>
                    <h3 className="mt-1 text-2xl font-black">Interview confidence</h3>
                  </div>
                  <span className="font-black text-[#2457D6] text-2xl">82%</span>
                </div>

                <div className="mt-10 h-44 flex items-end gap-3 border-b-2 border-[#14213D]/10">
                  {[35, 48, 43, 58, 63, 76, 82].map((height, index) => (
                    <div key={index} className="flex-1 h-full flex items-end">
                      <div
                        className={`w-full ${index === 6 ? "bg-[#FF6B57]" : "bg-[#2457D6]/20"} hover:bg-[#2457D6] transition-colors`}
                        style={{ height: `${height}%` }}
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-4 mt-7">
                  <div>
                    <p className="text-2xl font-black">24</p>
                    <p className="text-xs text-[#14213D]/50 mt-1">Interviews</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black">12</p>
                    <p className="text-xs text-[#14213D]/50 mt-1">Resumes analyzed</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-[#2457D6]">+14%</p>
                    <p className="text-xs text-[#14213D]/50 mt-1">Score improvement</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="max-w-2xl">
              <p className="font-serif italic text-2xl text-[#B7A000]">Why PrepGenius?</p>
              <h2 className="mt-2 text-4xl md:text-5xl font-black tracking-[-0.04em]">
                Built to make preparation feel like progress.
              </h2>
            </div>

            <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
              {features.map(([emoji, title, text]) => (
                <div key={title} className="border-t-2 border-[#14213D]/10 pt-5">
                  <div className="text-2xl">{emoji}</div>
                  <h3 className="mt-4 text-xl font-black">{title}</h3>
                  <p className="mt-2 text-[#14213D]/60 leading-7">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-5 sm:px-8 pb-20 md:pb-24 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="relative overflow-hidden bg-[#2457D6] text-white border-2 border-[#14213D] p-8 md:p-12 shadow-[10px_10px_0_#14213D]">
              <div className="absolute right-8 top-6 text-5xl rotate-12 text-[#B8E34B]">✦</div>
              <div className="absolute right-20 bottom-8 text-3xl text-[#FF6B57]">〰</div>

              <div className="relative max-w-3xl">
                <p className="font-serif italic text-2xl text-[#B8E34B]">One more thing...</p>
                <h2 className="mt-3 text-4xl md:text-6xl font-black tracking-[-0.05em] leading-[0.95]">
                  You don't need to be ready.
                  <br />
                  You just need to start.
                </h2>
                <p className="mt-6 text-white/75 text-lg leading-8 max-w-2xl">
                  Pick one thing to improve today. PrepGenius will help you take it from there.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    to="/mock-interview"
                    className="bg-[#B8E34B] text-[#14213D] px-6 py-3.5 rounded-xl font-black hover:bg-white transition-colors"
                  >
                    Start practicing →
                  </Link>
                  <Link
                    to="/resume-analyzer"
                    className="border-2 border-white/70 px-6 py-3.5 rounded-xl font-bold hover:bg-white hover:text-[#2457D6] transition-colors"
                  >
                    Analyze my resume
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#14213D] text-white py-12">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid md:grid-cols-3 gap-10">
          <div>
            <Link to="/" className="flex items-center gap-3">
              <img src="/prepgenius_logo_new.jpg" alt="PrepGenius" className="h-10 w-10 object-contain" />
              <div>
                <div className="text-xl font-bold">
                  Prep<span className="text-[#B8E34B]">Genius</span>
                </div>
                <div className="text-[9px] tracking-[0.16em] text-white/45 mt-1">
                  PREPARE • LEARN • SUCCEED
                </div>
              </div>
            </Link>
            <p className="mt-5 text-sm leading-7 text-white/55 max-w-sm">
              Helping students and job seekers prepare smarter for resumes and interviews.
            </p>
          </div>

          <div>
            <h4 className="font-bold">Quick links</h4>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-white/60">
              <Link to="/resume-analyzer" className="hover:text-white transition">Resume Analyzer</Link>
              <Link to="/resume-optimizer" className="hover:text-white transition">Resume Optimizer</Link>
              <Link to="/resume-builder" className="hover:text-white transition">Resume Builder</Link>
              <Link to="/mock-interview" className="hover:text-white transition">Mock Interview</Link>
              <Link to="/dashboard" className="hover:text-white transition">Dashboard</Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold">Meet the creator</h4>
            <p className="mt-4 text-sm font-semibold">Nancy Khandelwal</p>
            <p className="text-sm text-white/50 mt-1">AI/ML Developer</p>
            <div className="mt-4 space-y-2 text-sm text-white/60">
              <a href="mailto:khandelwalnancy27@gmail.com" className="block hover:text-white transition">
                khandelwalnancy27@gmail.com
              </a>
              <a
                href="https://www.linkedin.com/in/nancyk-ai-dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-white transition"
              >
                LinkedIn →
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-5 sm:px-8 mt-10 pt-6 border-t border-white/10 text-xs text-white/35">
          © 2026 PrepGenius. Built for better career preparation.
        </div>
      </footer>
    </div>
  );
}

export default Home;
