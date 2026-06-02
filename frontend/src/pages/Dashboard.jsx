import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold mb-2">
          Career Dashboard
        </h1>

        <p className="text-slate-600 mb-8">
          Track your preparation progress.
        </p>

        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-slate-500">ATS Score</h3>
            <p className="text-3xl font-bold">78%</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-slate-500">Matched Skills</h3>
            <p className="text-3xl font-bold">8</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-slate-500">Missing Skills</h3>
            <p className="text-3xl font-bold">4</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-slate-500">Interview Score</h3>
            <p className="text-3xl font-bold">7/10</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-white p-8 rounded-2xl shadow">
            <h2 className="text-2xl font-bold mb-4">
              Resume Analyzer
            </h2>

            <Link
              to="/resume-analyzer"
              className="bg-blue-600 text-white px-5 py-3 rounded-xl"
            >
              Open Resume Analyzer
            </Link>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow">
            <h2 className="text-2xl font-bold mb-4">
              Mock Interview
            </h2>

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