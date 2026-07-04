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
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-950 text-white rounded-3xl shadow-xl p-8 mb-8">
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <p className="text-sm uppercase tracking-widest text-blue-300 mb-3">
                Career Dashboard
              </p>
              
              
              <h1 className="text-4xl md:text-5xl font-bold">
                {greeting}
              </h1>

              <p className="text-slate-300 mt-4 max-w-3xl leading-7">
                Track your resume score, skill gaps, interview practice, and
                next steps from one place.
              </p>
            </div>

            <div className="bg-white/10 border border-white/10 rounded-3xl p-6">
              <p className="text-sm text-slate-300 mb-2">
                Placement readiness
              </p>

              <h2 className="text-5xl font-bold text-green-400">
                {readinessScore}%
              </h2>

              <div className="w-full bg-slate-700 rounded-full h-3 mt-5">
                <div
                  className="h-3 bg-green-400 rounded-full"
                  style={{ width: `${readinessScore}%` }}
                />
              </div>

              <p className="text-sm text-slate-400 mt-3">
                Based on resume score, skills and interview practice.
              </p>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Resume fit",
              value: `${atsScore}%`,
              note: "Latest ATS match",
              icon: <FileText size={22} />,
              bg: "bg-blue-50",
              color: "text-blue-600",
            },
            {
              title: "Matched skills",
              value: matchedSkills.length,
              note: "Found in resume",
              icon: <CheckCircle size={22} />,
              bg: "bg-green-50",
              color: "text-green-600",
            },
            {
              title: "Missing skills",
              value: missingSkills.length,
              note: "Need improvement",
              icon: <AlertCircle size={22} />,
              bg: "bg-red-50",
              color: "text-red-600",
            },
            {
              title: "Interview score",
              value: interviewScore,
              note: "Latest practice",
              icon: <Mic size={22} />,
              bg: "bg-indigo-50",
              color: "text-indigo-600",
            },
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-3xl shadow p-6">
              <div
                className={`w-12 h-12 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-5`}
              >
                {item.icon}
              </div>

              <p className="text-sm text-slate-500">{item.title}</p>
              <h2 className="text-3xl font-bold mt-1">{item.value}</h2>
              <p className="text-sm text-slate-500 mt-2">{item.note}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-3xl shadow p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <BarChart3 />
              </div>

              <div>
                <p className="text-sm text-blue-600 font-semibold">
                  Resume Health
                </p>
                <h2 className="text-2xl font-bold">
                  Latest resume fit score
                </h2>
              </div>
            </div>

            <div className="w-full bg-slate-200 rounded-full h-5 overflow-hidden mb-5">
              <div
                className="h-5 bg-blue-600 rounded-full"
                style={{ width: `${atsScore}%` }}
              />
            </div>

            <p className="text-sm text-slate-600">
              Your latest resume score is calculated from the skills matched
              against the job description.
            </p>
          </div>

          <div className="bg-slate-950 text-white rounded-3xl shadow p-8">
            <div className="w-12 h-12 rounded-2xl bg-white/10 text-blue-300 flex items-center justify-center mb-5">
              <Sparkles />
            </div>

            <h2 className="text-2xl font-bold mb-4">
              Today’s focus
            </h2>

            <div className="space-y-4">
              {recommendations.map((item, index) => (
                <div key={index} className="flex gap-3">
                  <CheckCircle size={18} className="text-green-400 mt-1" />
                  <p className="text-sm text-slate-300 leading-6">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-3xl shadow p-8">
            <h2 className="text-2xl font-bold mb-2">
              Skills already in your resume
            </h2>

            <p className="text-sm text-slate-600 mb-5">
              These skills matched your last job description.
            </p>

            <div className="flex flex-wrap gap-3">
              {matchedSkills.length > 0 ? (
                matchedSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-500">
                  No resume analysis found yet.
                </p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow p-8">
            <h2 className="text-2xl font-bold mb-2">
              Skills to work on next
            </h2>

            <p className="text-sm text-slate-600 mb-5">
              Add these clearly if they are relevant to your experience.
            </p>

            <div className="flex flex-wrap gap-3">
              {missingSkills.length > 0 ? (
                missingSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-red-100 text-red-800 px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-500">
                  No missing skills found yet.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
            <Link
              to="/resume-analyzer"
              className="bg-white rounded-3xl shadow p-8 hover:-translate-y-1 transition"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
                <FileText />
              </div>

              <h2 className="text-2xl font-bold mb-3">
                Analyze another resume
              </h2>

              <p className="text-slate-600 mb-6 leading-7">
                Upload your latest resume and compare it with a new job description.
              </p>

              <span className="text-blue-600 font-semibold inline-flex items-center gap-2">
                Open Resume Analyzer <ArrowRight size={18} />
              </span>
            </Link>

            <Link
              to="/mock-interview"
              className="bg-white rounded-3xl shadow p-8 hover:-translate-y-1 transition"
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5">
                <Mic />
              </div>

              <h2 className="text-2xl font-bold mb-3">
                Continue interview practice
              </h2>

              <p className="text-slate-600 mb-6 leading-7">
                Practice explaining your projects and technical skills clearly.
              </p>

              <span className="text-indigo-600 font-semibold inline-flex items-center gap-2">
                Start Practice <ArrowRight size={18} />
              </span>
            </Link>
          </div>

          <div className="bg-white rounded-3xl shadow p-8">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="text-blue-600" />
              <h2 className="text-2xl font-bold">Recent activity</h2>
            </div>

            <div className="space-y-5">
              <div className="border-l-4 border-blue-600 pl-4">
                <p className="font-semibold">Dashboard opened</p>
                <p className="text-sm text-slate-500">Just now</p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <p className="font-semibold">Resume score updated</p>
                <p className="text-sm text-slate-500">
                  After latest analysis
                </p>
              </div>

              <div className="border-l-4 border-indigo-500 pl-4">
                <p className="font-semibold">Interview practice saved</p>
                <p className="text-sm text-slate-500">
                  Score: {interviewScore}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow p-8 mt-8">
          <div className="flex items-center gap-3 mb-6">
            <Target className="text-blue-600" />
            <h2 className="text-2xl font-bold">Preparation roadmap</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              ["Resume", atsScore > 0 ? "In progress" : "Start now", atsScore],
              ["Skills", matchedSkills.length > 0 ? "Reviewed" : "Pending", matchedSkills.length * 10],
              ["Interview", interviewScore !== "Not started" ? "Practiced" : "Not started", interviewScore !== "Not started" ? 70 : 0],
            ].map((item, index) => (
              <div key={index} className="bg-slate-50 rounded-2xl p-5">
                <div className="flex justify-between mb-3">
                  <p className="font-semibold">{item[0]}</p>
                  <p className="text-sm text-slate-500">{item[1]}</p>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="h-3 bg-blue-600 rounded-full"
                    style={{ width: `${Math.min(100, item[2])}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
