import { Link } from "react-router-dom";
import {
  FileText,
  CheckCircle,
  AlertCircle,
  Mic,
  ArrowRight,
} from "lucide-react";

function Dashboard() {
  const atsScore = localStorage.getItem("atsScore") || "0";
  const matchedSkills = JSON.parse(localStorage.getItem("matchedSkills") || "[]");
  const missingSkills = JSON.parse(localStorage.getItem("missingSkills") || "[]");
  const interviewScore = localStorage.getItem("interviewScore") || "Not started";

  const stats = [
    { title: "ATS Score", value: `${atsScore}%`, icon: <FileText />, color: "text-indigo-600" },
    { title: "Matched Skills", value: matchedSkills.length, icon: <CheckCircle />, color: "text-green-600" },
    { title: "Missing Skills", value: missingSkills.length, icon: <AlertCircle />, color: "text-red-500" },
    { title: "Interview Score", value: interviewScore, icon: <Mic />, color: "text-sky-600" },
  ];

  return (
    <div className="min-h-screen gradient-bg px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <p className="text-indigo-600 font-bold mb-2">Career Overview</p>
          <h1 className="text-5xl font-black mb-3">
            Your PrepGenius <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-slate-600 text-lg">
            Track your resume score, skill gaps, and interview preparation in one place.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-10">
          {stats.map((item, index) => (
            <div key={index} className="soft-card rounded-3xl p-6">
              <div className={`w-12 h-12 rounded-2xl bg-white shadow flex items-center justify-center mb-4 ${item.color}`}>
                {item.icon}
              </div>
              <p className="text-slate-500 font-medium">{item.title}</p>
              <h2 className="text-3xl font-black mt-1">{item.value}</h2>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          <div className="soft-card rounded-3xl p-8">
            <h2 className="text-2xl font-black mb-5">Matched Skills</h2>
            <div className="flex flex-wrap gap-3">
              {matchedSkills.length > 0 ? (
                matchedSkills.map((skill, index) => (
                  <span key={index} className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-slate-500">No resume analysis yet.</p>
              )}
            </div>
          </div>

          <div className="soft-card rounded-3xl p-8">
            <h2 className="text-2xl font-black mb-5">Missing Skills</h2>
            <div className="flex flex-wrap gap-3">
              {missingSkills.length > 0 ? (
                missingSkills.map((skill, index) => (
                  <span key={index} className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-semibold">
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-slate-500">No missing skills found yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="soft-card rounded-3xl p-8">
            <div className="w-14 h-14 rounded-2xl gradient-btn text-white flex items-center justify-center mb-5">
              <FileText />
            </div>
            <h2 className="text-2xl font-black mb-3">Resume Analyzer</h2>
            <p className="text-slate-600 mb-6">
              Upload your resume and compare it with any job description.
            </p>
            <Link to="/resume-analyzer" className="gradient-btn text-white px-6 py-3 rounded-2xl font-bold inline-flex items-center gap-2">
              Analyze Resume <ArrowRight size={18} />
            </Link>
          </div>

          <div className="soft-card rounded-3xl p-8">
            <div className="w-14 h-14 rounded-2xl gradient-btn text-white flex items-center justify-center mb-5">
              <Mic />
            </div>
            <h2 className="text-2xl font-black mb-3">Mock Interview</h2>
            <p className="text-slate-600 mb-6">
              Practice personalized interview questions using AI.
            </p>
            <Link to="/mock-interview" className="gradient-btn text-white px-6 py-3 rounded-2xl font-bold inline-flex items-center gap-2">
              Start Interview <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
