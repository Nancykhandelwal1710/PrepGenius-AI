import { useState } from "react";
import axios from "axios";
import {
  Mic,
  Sparkles,
  CheckCircle,
  Target,
  Clock,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

const API_URL = "https://prepgenius-backend-3841.onrender.com";

function MockInterview() {
  const [role, setRole] = useState("");
  const [resumeText, setResumeText] = useState(
    localStorage.getItem("resumeText") || ""
  );
  const [jobDescription, setJobDescription] = useState("");

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateQuestions = async () => {
    if (!role.trim()) {
      alert("Please enter the role you are preparing for.");
      return;
    }

    try {
      setLoading(true);
      setQuestions([]);
      setCurrentIndex(0);
      setAnswer("");
      setFeedback("");
      setScore(null);

      const response = await axios.post(
        `${API_URL}/generate-interview-questions`,
        {
          role,
          resume_text: resumeText,
          job_description: jobDescription,
        }
      );

      setQuestions(response.data.questions || []);
    } catch (error) {
      console.error(error);
      alert("Could not generate questions right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = () => {
    let newScore = 0;
    let newFeedback = "";

    if (answer.length < 40) {
      newScore = 4;
      newFeedback =
        "Your answer is too short. Add context, one example, and explain the result.";
    } else if (answer.length < 130) {
      newScore = 7;
      newFeedback =
        "Good start. Add tools used, project details, and measurable impact to make it stronger.";
    } else {
      newScore = 9;
      newFeedback =
        "Strong answer. You explained clearly, added detail, and sounded interview-ready.";
    }

    setScore(newScore);
    setFeedback(newFeedback);
    localStorage.setItem("interviewScore", `${newScore}/10`);
  };

  const nextQuestion = () => {
    setCurrentIndex(currentIndex + 1);
    setAnswer("");
    setFeedback("");
    setScore(null);
  };

  const restartInterview = () => {
    setCurrentIndex(0);
    setAnswer("");
    setFeedback("");
    setScore(null);
  };

  const progress =
    questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  const completed =
    questions.length > 0 &&
    feedback &&
    currentIndex === questions.length - 1;

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-950 text-white rounded-3xl shadow-xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-widest text-blue-300 mb-3">
                Mock Interview
              </p>

              <h1 className="text-4xl md:text-5xl font-bold">
                Practice interviews with role-based questions
              </h1>

              <p className="text-slate-300 mt-4 max-w-3xl leading-7">
                Generate interview questions from your target role, resume, and
                job description. Practice structured answers before real interviews.
              </p>
            </div>

            <div className="bg-white/10 border border-white/10 rounded-2xl p-5 min-w-[220px]">
              <p className="text-sm text-slate-300">Preparation status</p>
              <h2 className="text-3xl font-bold mt-2">
                {questions.length > 0 ? `${Math.round(progress)}%` : "Ready"}
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                {questions.length > 0
                  ? "Interview in progress"
                  : "Start with your role"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="bg-white rounded-3xl shadow p-8">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
              <Target />
            </div>

            <h2 className="text-2xl font-bold mb-4">Interview Guide</h2>

            <div className="space-y-4">
              {[
                "Use one real project example.",
                "Mention tools and technologies.",
                "Explain your role clearly.",
                "Add result or impact.",
                "Keep answers structured.",
              ].map((tip, index) => (
                <div key={index} className="flex gap-3">
                  <CheckCircle className="text-green-600 mt-1" size={18} />
                  <p className="text-sm text-slate-700 leading-6">{tip}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-slate-50 rounded-2xl p-5">
              <p className="text-sm font-semibold text-slate-900 mb-2">
                Quick method
              </p>
              <p className="text-sm text-slate-600 leading-6">
                Answer using: Situation → Work done → Tools used → Result.
              </p>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-3xl shadow p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Sparkles />
              </div>

              <div>
                <p className="text-sm text-blue-600 font-semibold">
                  Interview Setup
                </p>
                <h2 className="text-2xl font-bold">
                  Tell PrepGenius what you are preparing for
                </h2>
              </div>
            </div>

            <label className="block text-sm font-semibold mb-2">
              Target role
            </label>

            <input
              type="text"
              placeholder="Example: AI/ML Engineer, Python Developer Intern"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-slate-300 rounded-xl p-4 mb-5"
            />

            <label className="block text-sm font-semibold mb-2">
              Resume text
            </label>

            <textarea
              rows="5"
              placeholder="Resume text appears here if you used Resume Analyzer first."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="w-full border border-slate-300 rounded-xl p-4 mb-5 text-sm"
            />

            <label className="block text-sm font-semibold mb-2">
              Job description
            </label>

            <textarea
              rows="5"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full border border-slate-300 rounded-xl p-4 mb-6 text-sm"
            />

            <button
              onClick={generateQuestions}
              disabled={loading}
              className="w-full bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 disabled:bg-slate-400"
            >
              {loading ? "Preparing questions..." : "Generate Interview"}
            </button>
          </div>
        </div>

        {questions.length > 0 && (
          <div className="bg-white rounded-3xl shadow p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <p className="text-sm text-blue-600 font-semibold">
                  Question {currentIndex + 1} of {questions.length}
                </p>

                <h2 className="text-3xl font-bold">Interview Practice</h2>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Clock size={18} />
                Write a clear answer before moving ahead
              </div>
            </div>

            <div className="w-full bg-slate-200 rounded-full h-3 mb-8 overflow-hidden">
              <div
                className="h-3 bg-blue-600 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="bg-slate-950 text-white rounded-3xl p-7 mb-6">
              <p className="text-sm text-blue-300 mb-3">
                Interview question
              </p>

              <p className="text-xl leading-9">
                {questions[currentIndex]}
              </p>
            </div>

            <label className="block text-sm font-semibold mb-2">
              Your answer
            </label>

            <textarea
              rows="8"
              placeholder="Write your answer here. Try to include a project, tools used, and result."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full border border-slate-300 rounded-xl p-4 text-sm"
            />

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4">
              <p className="text-sm text-slate-500">
                Characters: {answer.length}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={submitAnswer}
                  className="bg-green-600 text-white px-7 py-3 rounded-xl font-semibold hover:bg-green-700"
                >
                  Submit Answer
                </button>

                {feedback && currentIndex < questions.length - 1 && (
                  <button
                    onClick={nextQuestion}
                    className="bg-slate-900 text-white px-7 py-3 rounded-xl font-semibold hover:bg-slate-800 inline-flex items-center justify-center gap-2"
                  >
                    Next Question <ArrowRight size={18} />
                  </button>
                )}
              </div>
            </div>

            {feedback && (
              <div className="mt-8 grid lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 bg-blue-50 border border-blue-100 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-blue-900 mb-3">
                    Feedback
                  </h3>

                  <p className="text-sm text-blue-900 leading-7">
                    {feedback}
                  </p>

                  <div className="mt-5">
                    <p className="text-sm font-semibold text-blue-900 mb-2">
                      Improve by adding:
                    </p>

                    <ul className="text-sm text-blue-900 space-y-2">
                      <li>• One project example</li>
                      <li>• Technologies used</li>
                      <li>• Result or measurable outcome</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
                  <p className="text-sm text-green-700">
                    Practice score
                  </p>

                  <p className="text-5xl font-bold text-green-800 mt-2">
                    {score}/10
                  </p>

                  <p className="text-sm text-green-700 mt-3">
                    Based on answer clarity and detail.
                  </p>
                </div>
              </div>
            )}

            {completed && (
              <div className="mt-8 bg-slate-950 text-white rounded-3xl p-8">
                <h3 className="text-3xl font-bold">
                  Interview practice completed
                </h3>

                <p className="text-slate-300 mt-3 max-w-2xl leading-7">
                  You completed all generated questions. Try again with a
                  different role or job description to practice another interview.
                </p>

                <button
                  onClick={restartInterview}
                  className="mt-6 bg-white text-slate-950 px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2"
                >
                  <RotateCcw size={18} />
                  Practice Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MockInterview;
