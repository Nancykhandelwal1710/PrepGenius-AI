import { Link } from "react-router-dom";
import {
  FileText,
  CheckCircle,
  AlertCircle,
  Mic,
  ArrowRight,
  BarChart3,
} from "lucide-react";

function Dashboard() {
  const atsScore = localStorage.getItem("atsScore") || "0";
  const matchedSkills = JSON.parse(localStorage.getItem("matchedSkills") || "[]");
  const missingSkills = JSON.parse(localStorage.getItem("missingSkills") || "[]");
  const interviewScore = localStorage.getItem("interviewScore") || "Not started";

  const stats = [
    {
      title: "Resume match",
      value: `${atsScore}%`,
      note: "Latest ATS score",
      icon: <FileText size={22} />,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Skills found",
      value: matchedSkills.length,
      note: "Matched with JD",
      icon: <CheckCircle size={22} />,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Skills to improve",
      value: missingSkills.length,
      note: "Missing from resume",
      icon: <AlertCircle size={22} />,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      title: "Interview practice",
      value: interviewScore,
      note: "Latest score",
      icon: <Mic size={22} />,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-950 text-white rounded-3xl shadow-lg p-8 mb-8">
          <p className="text-sm uppercase tracking-widest text-blue-300 mb-3">
            Career Dashboard
          </p>

          <h1 className="text-4xl md:text-5xl font-bold">
            Track your preparation progress
          </h1>

          <p className="text-slate-300 mt-4 max-w-3xl leading-7">
            This dashboard shows your latest resume match, skill gaps, and mock
            interview status. Use it as a quick checkpoint while improving your profile.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((item, index) => (
            <div key={index} className="bg-white rounded-3xl shadow p-6">
              <div
                className={`w-12 h-12 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-5`}
              >
                {item.icon}
              </div>

              <p className="text-sm text-slate-500">
                {item.title}
              </p>

              <h2 className="text-3xl font-bold mt-1">
                {item.value}
              </h2>

              <p className="text-sm text-slate-500 mt-2">
                {item.note}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <p className="text-sm text-blue-600 font-semibold">
                Resume Score
              </p>

              <h2 className="text-2xl md:text-3xl font-bold">
                Latest resume match: {atsScore}%
              </h2>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <BarChart3 size={18} />
              Updated after your last analysis
            </div>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-5 overflow-hidden">
            <div
              className="h-5 bg-blue-600 rounded-full"
              style={{ width: `${atsScore}%` }}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-3xl shadow p-8">
            <h2 className="text-2xl font-bold mb-2">
              Skills already in your resume
            </h2>

            <p className="text-sm text-slate-600 mb-5">
              These skills matched the job description from your latest resume check.
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
                  No analysis found yet. Start by checking your resume.
                </p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow p-8">
            <h2 className="text-2xl font-bold mb-2">
              Skills to work on next
            </h2>

            <p className="text-sm text-slate-600 mb-5">
              These skills were found in the job description but not clearly in your resume.
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

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl shadow p-8">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
              <FileText />
            </div>

            <h2 className="text-2xl font-bold mb-3">
              Check another resume
            </h2>

            <p className="text-slate-600 mb-6 leading-7">
              Upload your latest resume and compare it with a new job description.
            </p>

            <Link
              to="/resume-analyzer"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2 hover:bg-blue-700"
            >
              Open Resume Analyzer <ArrowRight size={18} />
            </Link>
          </div>

          <div className="bg-white rounded-3xl shadow p-8">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5">
              <Mic />
            </div>

            <h2 className="text-2xl font-bold mb-3">
              Continue interview practice
            </h2>

            <p className="text-slate-600 mb-6 leading-7">
              Generate role-based questions and practice explaining your projects clearly.
            </p>

            <Link
              to="/mock-interview"
              className="bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2 hover:bg-slate-800"
            >
              Start Practice <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
