import { auth } from "../firebase";
import { Link } from "react-router-dom";
import {
  FileText,
  CheckCircle,
  AlertCircle,
  Mic,
  ArrowRight,
  BarChart3,
  Target,
  Sparkles,
  Clock,
  TrendingUp,
} from "lucide-react";

function Dashboard() {
  const atsScore = Number(localStorage.getItem("atsScore") || "0");
  const matchedSkills = JSON.parse(localStorage.getItem("matchedSkills") || "[]");
  const missingSkills = JSON.parse(localStorage.getItem("missingSkills") || "[]");
  const interviewScore = localStorage.getItem("interviewScore") || "Not started";
  const userName = auth.currentUser?.displayName?.split(" ")[0] || "";
  const greeting = userName ? `Welcome back, ${userName} 👋` : "Welcome 👋";

  const readinessScore = Math.min(
    100,
    Math.round(
      (atsScore * 0.6) +
      (matchedSkills.length * 3) +
      (interviewScore !== "Not started" ? 15 : 0)
    )
  );

  const recommendations = [
    missingSkills.length > 0
      ? `Improve ${missingSkills[0]} and add it clearly in your resume.`
      : "Your resume has no major missing skill from the last analysis.",
    "Add measurable outcomes in your project descriptions.",
    "Practice one technical and one HR answer today.",
  ];

  return (
    <div className="min-h-screen bg-[#FBFAF6] text-[#14213D] px-4 sm:px-6 py-8 md:py-10">
      <div className="max-w-7xl mx-auto">

        {/* Welcome */}
        <section className="relative overflow-hidden bg-[#2457D6] text-white border-2 border-[#14213D] p-7 md:p-10 shadow-[8px_8px_0_#14213D]">
          <div className="absolute -right-10 -top-16 text-[11rem] leading-none font-black text-white/5">
            ✦
          </div>
          <div className="absolute right-8 bottom-5 text-5xl text-[#B8E34B] rotate-12">
            ↗
          </div>

          <div className="relative grid lg:grid-cols-[1fr_300px] gap-8 items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#B8E34B]">
                Your PrepGenius space
              </p>
              <h1 className="mt-3 text-4xl md:text-6xl font-black tracking-[-0.05em] leading-[0.95]">
                {greeting}
              </h1>
              <p className="mt-5 max-w-2xl text-white/75 text-base md:text-lg leading-7">
                You're not here just to collect scores. You're here to get better.
                Here's where your resume, skills and interview practice come together.
              </p>
            </div>

            <div className="bg-white text-[#14213D] border-2 border-[#14213D] p-6 shadow-[5px_5px_0_#14213D] rotate-1">
              <p className="text-xs font-black uppercase tracking-wider text-[#14213D]/50">
                Placement readiness
              </p>
              <div className="mt-1 flex items-end justify-between">
                <h2 className="text-5xl font-black">{readinessScore}%</h2>
                <span className="text-2xl">🎯</span>
              </div>
              <div className="mt-4 h-3 bg-[#E6EAF2] overflow-hidden">
                <div
                  className="h-full bg-[#B8E34B]"
                  style={{ width: `${readinessScore}%` }}
                />
              </div>
              <p className="mt-3 text-xs leading-5 text-[#14213D]/55">
                Based on your resume score, matched skills and interview practice.
              </p>
            </div>
          </div>
        </section>

        {/* Snapshot */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {[
            {
              title: "Resume fit",
              value: `${atsScore}%`,
              note: "Latest ATS match",
              icon: <FileText size={21} />,
              bg: "bg-[#EDF3FF]",
              color: "text-[#2457D6]",
            },
            {
              title: "Matched skills",
              value: matchedSkills.length,
              note: "Found in resume",
              icon: <CheckCircle size={21} />,
              bg: "bg-[#F1F7D9]",
              color: "text-[#648400]",
            },
            {
              title: "Missing skills",
              value: missingSkills.length,
              note: "Need improvement",
              icon: <AlertCircle size={21} />,
              bg: "bg-[#FFF0EC]",
              color: "text-[#E44E3C]",
            },
            {
              title: "Interview score",
              value: interviewScore,
              note: "Latest practice",
              icon: <Mic size={21} />,
              bg: "bg-[#EEF0FF]",
              color: "text-[#2457D6]",
            },
          ].map((item, index) => (
            <div
              key={index}
              className={`bg-white border-2 border-[#14213D]/10 p-5 hover:-translate-y-1 transition-transform ${
                index % 2 === 0 ? "rounded-2xl" : "rounded-md"
              }`}
            >
              <div className={`w-11 h-11 ${item.bg} ${item.color} flex items-center justify-center rounded-xl`}>
                {item.icon}
              </div>
              <p className="mt-5 text-sm font-semibold text-[#14213D]/50">{item.title}</p>
              <h2 className="mt-1 text-3xl font-black tracking-tight">{item.value}</h2>
              <p className="mt-1 text-xs text-[#14213D]/45">{item.note}</p>
            </div>
          ))}
        </section>

        {/* Today's focus + resume health */}
        <section className="grid lg:grid-cols-[1.35fr_0.65fr] gap-6 mt-8">
          <div className="bg-white border-2 border-[#14213D] p-7 md:p-8 shadow-[6px_6px_0_#B8E34B]">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-sm font-serif italic text-[#2457D6]">
                  Resume health
                </p>
                <h2 className="mt-1 text-3xl md:text-4xl font-black tracking-[-0.04em]">
                  How strong is your latest resume?
                </h2>
              </div>
              <div className="hidden sm:block text-4xl">📄</div>
            </div>

            <div className="mt-8 flex items-end gap-4">
              <span className="text-6xl md:text-7xl font-black tracking-[-0.06em] text-[#2457D6]">
                {atsScore}
              </span>
              <span className="pb-2 text-[#14213D]/45 font-semibold">/ 100</span>
            </div>

            <div className="mt-5 h-4 bg-[#E8EBF2] overflow-hidden">
              <div
                className="h-full bg-[#2457D6]"
                style={{ width: `${atsScore}%` }}
              />
            </div>

            <p className="mt-5 max-w-2xl text-sm md:text-base leading-7 text-[#14213D]/60">
              Your latest resume score is calculated from the skills matched
              against the job description.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/resume-analyzer"
                className="inline-flex items-center gap-2 bg-[#14213D] text-white px-5 py-3 rounded-xl font-bold hover:bg-[#2457D6] transition-colors"
              >
                Analyze resume <ArrowRight size={17} />
              </Link>
              <Link
                to="/resume-optimizer"
                className="inline-flex items-center gap-2 border-2 border-[#14213D] px-5 py-3 rounded-xl font-bold hover:bg-[#B8E34B] transition-colors"
              >
                Improve it <Sparkles size={17} />
              </Link>
            </div>
          </div>

          <div className="bg-[#FFF0EC] border-2 border-[#14213D] p-7 md:p-8 shadow-[6px_6px_0_#FF6B57]">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 bg-[#FF6B57] text-white flex items-center justify-center rounded-xl">
                <Sparkles size={21} />
              </div>
              <span className="font-serif italic text-[#14213D]/45">today</span>
            </div>

            <h2 className="mt-7 text-3xl font-black tracking-[-0.04em]">
              Today's focus
            </h2>

            <div className="mt-6 space-y-5">
              {recommendations.map((item, index) => (
                <div key={index} className="flex gap-3">
                  <span className="shrink-0 mt-0.5 h-6 w-6 bg-white border border-[#14213D]/10 flex items-center justify-center text-xs font-black">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-6 text-[#14213D]/70">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills */}
        <section className="grid lg:grid-cols-2 gap-6 mt-8">
          <div className="bg-[#EDF3FF] border-2 border-[#14213D]/10 p-7 md:p-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-serif italic text-[#2457D6]">You've got these</p>
                <h2 className="mt-1 text-2xl md:text-3xl font-black tracking-tight">
                  Skills already in your resume
                </h2>
              </div>
              <span className="text-3xl">✓</span>
            </div>

            <p className="mt-3 text-sm text-[#14213D]/55">
              These skills matched your last job description.
            </p>

            <div className="flex flex-wrap gap-2 mt-6">
              {matchedSkills.length > 0 ? (
                matchedSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-white border border-[#2457D6]/20 text-[#2457D6] px-4 py-2 rounded-full text-sm font-bold"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-sm text-[#14213D]/50">
                  No resume analysis found yet.
                </p>
              )}
            </div>
          </div>

          <div className="bg-[#FFF0EC] border-2 border-[#14213D]/10 p-7 md:p-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-serif italic text-[#FF6B57]">Next up</p>
                <h2 className="mt-1 text-2xl md:text-3xl font-black tracking-tight">
                  Skills to work on next
                </h2>
              </div>
              <span className="text-3xl">→</span>
            </div>

            <p className="mt-3 text-sm text-[#14213D]/55">
              Add these clearly if they are relevant to your experience.
            </p>

            <div className="flex flex-wrap gap-2 mt-6">
              {missingSkills.length > 0 ? (
                missingSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-white border border-[#FF6B57]/30 text-[#D94A39] px-4 py-2 rounded-full text-sm font-bold"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-sm text-[#14213D]/50">
                  No missing skills found yet.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Main actions */}
        <section className="mt-10">
          <div className="flex items-end justify-between gap-5">
            <div>
              <p className="text-xl font-serif italic text-[#2457D6]">What next?</p>
              <h2 className="mt-1 text-3xl md:text-4xl font-black tracking-[-0.04em]">
                Pick one thing and keep moving.
              </h2>
            </div>
            <TrendingUp className="hidden sm:block text-[#2457D6]" size={30} />
          </div>

          <div className="grid md:grid-cols-2 gap-5 mt-7">
            <Link
              to="/resume-analyzer"
              className="group bg-white border-2 border-[#14213D]/10 p-7 md:p-8 hover:border-[#2457D6] hover:-translate-y-1 transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="w-14 h-14 bg-[#2457D6] text-white flex items-center justify-center rounded-xl">
                  <FileText />
                </div>
                <ArrowRight className="text-[#2457D6] group-hover:translate-x-1 transition-transform" />
              </div>
              <h2 className="mt-7 text-2xl font-black">Analyze another resume</h2>
              <p className="mt-3 text-[#14213D]/60 leading-7">
                Upload your latest resume and compare it with a new job description.
              </p>
              <span className="mt-6 inline-flex text-[#2457D6] font-black">
                Open Resume Analyzer →
              </span>
            </Link>

            <Link
              to="/mock-interview"
              className="group bg-[#14213D] text-white border-2 border-[#14213D] p-7 md:p-8 hover:bg-[#2457D6] hover:-translate-y-1 transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="w-14 h-14 bg-[#B8E34B] text-[#14213D] flex items-center justify-center rounded-xl">
                  <Mic />
                </div>
                <ArrowRight className="text-[#B8E34B] group-hover:translate-x-1 transition-transform" />
              </div>
              <h2 className="mt-7 text-2xl font-black">Continue interview practice</h2>
              <p className="mt-3 text-white/65 leading-7">
                Practice explaining your projects and technical skills clearly.
              </p>
              <span className="mt-6 inline-flex text-[#B8E34B] font-black">
                Start Practice →
              </span>
            </Link>
          </div>
        </section>

        {/* Activity + roadmap */}
        <section className="grid lg:grid-cols-[0.8fr_1.2fr] gap-6 mt-8">
          <div className="bg-white border-2 border-[#14213D]/10 p-7 md:p-8">
            <div className="flex items-center gap-3">
              <Clock className="text-[#2457D6]" />
              <h2 className="text-2xl font-black">Recent activity</h2>
            </div>

            <div className="mt-7 space-y-6">
              <div className="border-l-4 border-[#2457D6] pl-4">
                <p className="font-bold">Dashboard opened</p>
                <p className="text-sm text-[#14213D]/45 mt-1">Just now</p>
              </div>

              <div className="border-l-4 border-[#B8E34B] pl-4">
                <p className="font-bold">Resume score updated</p>
                <p className="text-sm text-[#14213D]/45 mt-1">After latest analysis</p>
              </div>

              <div className="border-l-4 border-[#FF6B57] pl-4">
                <p className="font-bold">Interview practice saved</p>
                <p className="text-sm text-[#14213D]/45 mt-1">
                  Score: {interviewScore}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#EEF3FF] border-2 border-[#14213D] p-7 md:p-8 shadow-[6px_6px_0_#2457D6]">
            <div className="flex items-center gap-3">
              <Target className="text-[#2457D6]" />
              <div>
                <p className="text-sm font-serif italic text-[#2457D6]">Your route</p>
                <h2 className="text-2xl font-black">Preparation roadmap</h2>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-7">
              {[
                ["Resume", atsScore > 0 ? "In progress" : "Start now", atsScore, "📄"],
                ["Skills", matchedSkills.length > 0 ? "Reviewed" : "Pending", matchedSkills.length * 10, "🎯"],
                ["Interview", interviewScore !== "Not started" ? "Practiced" : "Not started", interviewScore !== "Not started" ? 70 : 0, "🎤"],
              ].map((item, index) => (
                <div key={index} className="bg-white p-5 border border-[#14213D]/10">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-black">{item[0]}</p>
                      <p className="text-xs text-[#14213D]/45 mt-1">{item[1]}</p>
                    </div>
                    <span className="text-xl">{item[3]}</span>
                  </div>

                  <div className="w-full bg-[#E1E6F0] h-2 mt-6">
                    <div
                      className="h-full bg-[#2457D6]"
                      style={{ width: `${Math.min(100, item[2])}%` }}
                    />
                  </div>
                  <p className="text-xs font-bold text-[#2457D6] mt-2">
                    {Math.min(100, item[2])}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom encouragement */}
        <section className="mt-10 mb-4 bg-[#B8E34B] border-2 border-[#14213D] p-7 md:p-8 shadow-[6px_6px_0_#14213D]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="font-serif italic text-xl">Keep going.</p>
              <h2 className="mt-1 text-3xl md:text-4xl font-black tracking-[-0.04em]">
                One better answer at a time.
              </h2>
            </div>
            <Link
              to="/mock-interview"
              className="shrink-0 inline-flex items-center justify-center gap-2 bg-[#14213D] text-white px-6 py-3.5 rounded-xl font-black hover:bg-[#2457D6] transition-colors"
            >
              Practice now <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
export default Dashboard;