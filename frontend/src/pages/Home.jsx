import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-slate-950 to-slate-950" />

        <div className="relative max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <span className="inline-block bg-blue-500/10 border border-blue-400/30 text-blue-300 px-4 py-2 rounded-full text-sm mb-6">
              Built for students preparing for internships and placements
            </span>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Prepare your resume and interviews with one focused platform
            </h1>

            <p className="text-slate-300 text-lg leading-8 mb-8 max-w-xl">
              PrepGenius helps you compare your resume with a job description,
              find missing skills, and practice interview questions before applying.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/resume-analyzer"
                className="bg-blue-600 hover:bg-blue-700 px-7 py-3 rounded-xl font-semibold text-center"
              >
                Analyze Resume
              </Link>

              <Link
                to="/mock-interview"
                className="border border-slate-500 hover:bg-white hover:text-slate-950 px-7 py-3 rounded-xl font-semibold text-center"
              >
                Optimize Resume
              </Link>

              <Link
                to="/resume-builder"
                className="bg-blue-600 hover:bg-blue-700 px-7 py-3 rounded-xl font-semibold text-center"
              >
                Practice Interview
              </Link>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-13 max-w-xxxl">
              <div>
                <h3 className="text-xl font-bold text-blue-300">
                  Resume
                </h3>
                <p className="text-sm text-slate-400">
                  Analysis
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-blue-300">
                  Skills
                </h3>
                <p className="text-sm text-slate-400">
                  Gap check
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-blue-300">
                  Resume
                </h3>
                <p className="text-sm text-slate-400">
                  Optimization
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-blue-300">
                  Interview
                </h3>
                <p className="text-sm text-slate-400">
                  Practice
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-3xl p-6 shadow-2xl">
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-slate-400">
                    Resume Match
                  </p>

                  <h2 className="text-4xl font-bold text-green-400">
                    82%
                  </h2>
                </div>

                <div className="bg-blue-600/20 text-blue-300 px-4 py-2 rounded-xl text-sm">
                  Good match
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Matched skills</span>
                    <span>8 found</span>
                  </div>

                  <div className="h-3 bg-slate-700 rounded-full">
                    <div className="h-3 w-4/5 bg-blue-500 rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Skills to improve</span>
                    <span>4 missing</span>
                  </div>

                  <div className="h-3 bg-slate-700 rounded-full">
                    <div className="h-3 w-2/5 bg-orange-400 rounded-full" />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm text-slate-400 mb-3">
                  Skills found
                </p>

                <div className="flex flex-wrap gap-2">
                  {["Python", "React", "AWS", "SQL"].map((skill) => (
                    <span
                      key={skill}
                      className="bg-green-500/10 text-green-300 px-3 py-1 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm text-slate-400 mb-3">
                  Next focus
                </p>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-800 p-4 rounded-xl">
                    <p className="text-sm text-slate-400">
                      Resume Analyzer
                    </p>
                    <p className="font-semibold mt-1">
                      Add project impact
                    </p>
                  </div>

                  <div className="bg-slate-800 p-4 rounded-xl">
                    <p className="text-sm text-slate-400">
                      Resume Optimizer
                    </p>
                    <p className="font-semibold mt-1">
                      Optimize with Job description
                    </p>
                  </div>

                  <div className="bg-slate-800 p-4 rounded-xl">
                    <p className="text-sm text-slate-400">
                      Mock Interview
                    </p>
                    <p className="font-semibold mt-1">
                      Practice 5 questions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 border-y border-white/10 py-10">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm text-slate-400 mb-6">
            Built using modern tools
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            {["React", "FastAPI", "Gemini AI", "Firebase", "Tailwind"].map(
              (tech) => (
                <div
                  key={tech}
                  className="bg-white/5 border border-white/10 rounded-2xl py-4 text-slate-300 font-medium"
                >
                  {tech}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 text-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <p className="text-blue-600 font-semibold mb-3">
              How it works
            </p>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              A simple flow for placement preparation
            </h2>

            <p className="text-slate-600 leading-7">
              The process is built around what students actually need before
              applying: resume matching, skill clarity, and interview practice.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              [
                "1",
                "Upload resume",
                "Add your latest PDF resume for text extraction.",
              ],
              [
                "2",
                "Paste job description",
                "Add the role requirements you want to target.",
              ],
              [
                "3",
                "Review score",
                "Check matched skills, missing skills, and suggestions.",
              ],
              [
                "4",
                "Optimize Resume",
                "Enhance resume based on Target role and Job Description.",
              ],
              [
                "5",
                "Practice interview",
                "Generate role-based questions and prepare answers.",
              ],
            ].map((item) => (
              <div
                key={item[0]}
                className="bg-white p-7 rounded-2xl shadow-sm border hover:shadow-lg transition"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold mb-5">
                  {item[0]}
                </div>

                <h3 className="text-xl font-bold mb-3">
                  {item[1]}
                </h3>

                <p className="text-slate-600 leading-7 text-sm">
                  {item[2]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white text-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-12">
            <p className="text-blue-600 font-semibold mb-3">
              Features
            </p>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything needed for focused career preparation
            </h2>

            <p className="text-slate-600 leading-7">
              PrepGenius combines resume analysis and interview practice so you
              can prepare with a clearer plan.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              [
                "Resume Analyzer",
                "Upload your resume and extract useful content from it.",
              ],
              [
                "ATS Score",
                "Compare your resume with a job description and check the match.",
              ],
              [
                "Skill Gap Detection",
                "See which required skills are missing from your resume.",
              ],
              [
                "Resume Suggestions",
                "Get simple suggestions to improve your resume content.",
              ],
              [
                "Resume Optimizer",
                "Enhance your resume with targeted job description & improvements.",
              ],
              [
                "Mock Interview",
                "Generate questions for your target role and practice answers.",
              ],
              [
                "Progress Dashboard",
                "Track your latest score, matched skills, and preparation status.",
              ],
            ].map((item, index) => (
              <div
                key={index}
                className="bg-slate-50 p-7 rounded-2xl shadow-sm border hover:shadow-lg hover:-translate-y-1 transition"
              >
                <h3 className="text-xl font-bold mb-3">
                  {item[0]}
                </h3>

                <p className="text-slate-600 leading-7 text-sm">
                  {item[1]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-100 text-slate-900 py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to improve your preparation?
          </h2>

          <p className="text-slate-600 leading-7 max-w-2xl mx-auto mb-8">
            Start by checking your resume against a real job description, enhance it accordingly and then
            practice interview questions based on your target role.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/resume-analyzer"
              className="bg-blue-600 hover:bg-blue-700 px-7 py-3 rounded-xl font-semibold text-white text-center"
            >
              Analyze Resume
            </Link>

            <Link
              to="/mock-interview"
              className="bg-slate-900 hover:bg-slate-800 px-7 py-3 rounded-xl font-semibold text-white text-center"
            >
              Optimize Resume
            </Link>

            <Link
              to="/resume-analyzer"
              className="bg-blue-600 hover:bg-blue-700 px-7 py-3 rounded-xl font-semibold text-white text-center"
            >
              Practice Interview
            </Link>

          </div>
        </div>
      </section>

      <footer className="bg-slate-950 text-slate-300 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-2xl font-bold mb-3">
              PrepGenius AI
            </h3>

            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-xs text-blue-300 mb-4">
              AI Career Assistant
            </div>

            <p className="text-sm leading-7 text-slate-400">
              Helping students build ATS-friendly resumes,
              optimize resumes and prepare for interviews.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">
              Quick Links
            </h4>

            <div className="space-y-3 text-sm">
              <Link to="/resume-analyzer" className="block hover:text-white">
                Resume Analyzer
              </Link>
              <Link to="/resume-builder" className="block hover:text-white transition">
                Resume Optimizer
              </Link>
              <Link to="/mock-interview" className="block hover:text-white">
                Mock Interview
              </Link>
              <Link to="/dashboard" className="block hover:text-white">
                Dashboard
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">
              Meet the Creator
            </h4>

            <p className="text-sm text-white font-medium">
              Nancy Khandelwal
            </p>

            <p className="text-sm text-slate-400 mt-1">
              AI/ML Developer
            </p>

            <div className="mt-5 space-y-3 text-sm">
              <a
                href="mailto:khandelwalnancy27@gmail.com"
                className="block hover:text-white transition"
              >
                📧 khandelwalnancy27@gmail.com
              </a>

              <a
                href="https://www.linkedin.com/in/nancyk-ai-dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-white transition"
              >
                💼 LinkedIn
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-10 pt-6 border-t border-white/10 text-sm text-slate-500">
          © 2026 PrepGenius AI. Built as a career preparation project.
        </div>
      </footer>
    </div>
  );
}

export default Home;