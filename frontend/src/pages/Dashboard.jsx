import { Link } from "react-router-dom";

function Dashboard() {
  const atsScore = localStorage.getItem("atsScore") || "0";

  const matchedSkills = JSON.parse(
    localStorage.getItem("matchedSkills") || "[]"
  );

  const missingSkills = JSON.parse(
    localStorage.getItem("missingSkills") || "[]"
  );

  const interviewScore = localStorage.getItem("interviewScore") || "Not started";

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold mb-2">
          Career Dashboard
        </h1>

        <p className="text-slate-600 mb-8">
          Track your latest resume analysis and mock interview progress.
        </p>

        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-slate-500">ATS Score</h3>
            <p className="text-3xl font-bold">{atsScore}%</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-slate-500">Matched Skills</h3>
            <p className="text-3xl font-bold">{matchedSkills.length}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-slate-500">Missing Skills</h3>
            <p className="text-3xl font-bold">{missingSkills.length}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-slate-500">Interview Score</h3>
            <p className="text-3xl font-bold">{interviewScore}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-8 rounded-2xl shadow">
            <h2 className="text-2xl font-bold mb-4">
              Matched Skills
            </h2>

            <div className="flex flex-wrap gap-3">
              {matchedSkills.length > 0 ? (
                matchedSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-medium"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-slate-500">
                  No resume analysis yet.
                </p>
              )}
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow">
            <h2 className="text-2xl font-bold mb-4">
              Missing Skills
            </h2>

            <div className="flex flex-wrap gap-3">
              {missingSkills.length > 0 ? (
                missingSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-red-100 text-red-800 px-4 py-2 rounded-lg font-medium"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-slate-500">
                  No missing skills found yet.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-2xl shadow">
            <h2 className="text-2xl font-bold mb-4">
              Resume Analyzer
            </h2>

            <p className="text-slate-600 mb-6">
              Upload your resume and compare it with a job description.
            </p>

            <Link
              to="/resume-analyzer"
              className="bg-blue-600 text-white px-5 py-3 rounded-xl"
            >
              Analyze Resume
            </Link>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow">
            <h2 className="text-2xl font-bold mb-4">
              Mock Interview
            </h2>

            <p className="text-slate-600 mb-6">
              Generate personalized interview questions using Gemini AI.
            </p>

            <Link
              to="/mock-interview"
              className="bg-slate-900 text-white px-5 py-3 rounded-xl"
            >
              Start Interview
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
