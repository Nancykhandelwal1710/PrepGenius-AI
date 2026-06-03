import { Link } from "react-router-dom";
import {
  FileText,
  Mic,
  BarChart3,
  Target,
  Sparkles,
  CheckCircle,
} from "lucide-react";

function Home() {
  const features = [
    {
      icon: <FileText />,
      title: "AI Resume Analyzer",
      desc: "Check ATS score, matched skills, missing skills and improvement tips.",
    },
    {
      icon: <Mic />,
      title: "AI Mock Interview",
      desc: "Practice role-based questions and improve your answers.",
    },
    {
      icon: <Target />,
      title: "Skill Gap Analysis",
      desc: "Find missing skills from the job description instantly.",
    },
    {
      icon: <BarChart3 />,
      title: "Career Dashboard",
      desc: "Track resume score, interviews and preparation progress.",
    },
  ];

  return (
    <div className="min-h-screen gradient-bg">
      <section className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow text-indigo-600 font-semibold mb-6">
            <Sparkles size={18} />
            AI Powered Career Preparation
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            Ace Your Career with{" "}
            <span className="gradient-text">AI Power</span>
          </h1>

          <p className="text-xl text-slate-600 mb-8 max-w-xl">
            Analyze resumes, calculate ATS scores, identify skill gaps and
            prepare for interviews with your personal AI career coach.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/resume-analyzer"
              className="gradient-btn text-white px-8 py-4 rounded-2xl font-bold shadow-xl text-center"
            >
              Analyze Resume
            </Link>

            <Link
              to="/mock-interview"
              className="bg-white text-slate-800 px-8 py-4 rounded-2xl font-bold shadow border text-center"
            >
              Start Mock Interview
            </Link>
             
            <Link
              to="/dashboard"
              className="bg-white text-slate-800 px-8 py-4 rounded-2xl font-bold shadow border text-center"
            >
              Dashboard
            </Link>

          </div>
        </div>

        <div className="soft-card rounded-[2rem] p-8">
          <div className="bg-gradient-to-br from-indigo-100 to-sky-100 rounded-[2rem] p-8 text-center">
            <div className="w-32 h-32 mx-auto rounded-full gradient-btn flex items-center justify-center text-white text-6xl shadow-2xl mb-6">
              🤖
            </div>

            <h2 className="text-3xl font-black mb-4">
              Your AI Career Coach
            </h2>

            <div className="space-y-4 text-left">
              {[
                "ATS score calculation",
                "Resume improvement suggestions",
                "Personalized interview questions",
                "Career progress dashboard",
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow"
                >
                  <CheckCircle className="text-green-500" />
                  <span className="font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className="text-4xl font-black mb-3">Our Features</h2>
        <p className="text-slate-600 mb-10">
          Everything you need to prepare smarter and faster.
        </p>

        <div className="grid md:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="soft-card rounded-3xl p-6 hover:-translate-y-2 transition">
              <div className="w-14 h-14 rounded-2xl gradient-btn text-white flex items-center justify-center mb-5">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-slate-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
