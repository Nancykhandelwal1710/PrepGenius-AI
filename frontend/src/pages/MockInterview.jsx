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
  Volume2,
  Radio,
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
  const [listening, setListening] = useState(false);

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

  const speakQuestion = () => {
    if (!questions[currentIndex]) return;

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(questions[currentIndex]);
    speech.lang = "en-US";
    speech.rate = 0.9;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
  };

  const startVoiceAnswer = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    setListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;


      

      setAnswer((prev) => {
        if (!prev) return transcript;
        return `${prev} ${transcript}`;
      });
    };

    recognition.onerror = (event) => {
      console.error(event.error);
      setListening(false);
      alert("Voice input stopped. Please try again.");
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  const submitAnswer = () => {
    let newScore = 0;
    let newFeedback = "";

    const fillerWords = ["um", "uh", "like", "actually", "basically"];
    const lowerAnswer = answer.toLowerCase();

    const fillerCount = fillerWords.reduce((count, word) => {
      return count + (lowerAnswer.split(word).length - 1);
    }, 0);

    if (answer.length < 40) {
      newScore = 4;
      newFeedback =
        "Your answer is short. Add context, one project example, and explain the result.";
    } else if (answer.length < 130) {
      newScore = 7;
      newFeedback =
        "Good start. Add tools used, project details, and measurable impact to make it stronger.";
    } else {
      newScore = 9;
      newFeedback =
        "Strong answer. You explained clearly, added detail, and sounded interview-ready.";
    }

    if (fillerCount > 3) {
      newScore = Math.max(3, newScore - 1);
      newFeedback += " Try reducing filler words like um, uh, like, and basically.";
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
    window.speechSynthesis.cancel();
  };

  const restartInterview = () => {
    setCurrentIndex(0);
    setAnswer("");
    setFeedback("");
    setScore(null);
    window.speechSynthesis.cancel();
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
                AI Voice Mock Interview
              </p>

              <h1 className="text-4xl md:text-5xl font-bold">
                Practice interviews by speaking your answers
              </h1>

              <p className="text-slate-300 mt-4 max-w-3xl leading-7">
                Generate role-based questions, listen to them aloud, answer by
                voice, and get quick feedback on clarity, detail, and confidence.
              </p>
            </div>

            <div className="bg-white/10 border border-white/10 rounded-2xl p-5 min-w-[220px]">
              <p className="text-sm text-slate-300">Voice mode</p>
              <h2 className="text-3xl font-bold mt-2">
                {listening ? "Listening..." : "Ready"}
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Works best in Chrome
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="bg-white rounded-3xl shadow p-8">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
              <Target />
            </div>

            <h2 className="text-2xl font-bold mb-4">Voice Interview Guide</h2>

            <div className="space-y-4">
              {[
                "Listen to the question first.",
                "Answer naturally like a real interview.",
                "Use one real project example.",
                "Mention tools and impact.",
                "Avoid too many filler words.",
              ].map((tip, index) => (
                <div key={index} className="flex gap-3">
                  <CheckCircle className="text-green-600 mt-1" size={18} />
                  <p className="text-sm text-slate-700 leading-6">{tip}</p>
                </div>
              ))}
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
                  Set your interview target
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
              {loading ? "Preparing questions..." : "Generate Voice Interview"}
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

                <h2 className="text-3xl font-bold">Verbal Answer Practice</h2>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Clock size={18} />
                Speak clearly and naturally
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

              <button
                onClick={speakQuestion}
                className="mt-6 bg-white text-slate-950 px-5 py-3 rounded-xl font-semibold inline-flex items-center gap-2"
              >
                <Volume2 size={18} />
                Speak Question
              </button>
            </div>

            <label className="block text-sm font-semibold mb-2">
              Your spoken answer
            </label>

            <textarea
              rows="8"
              placeholder="Your spoken answer will appear here. You can also type or edit it manually."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full border border-slate-300 rounded-xl p-4 text-sm"
            />

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4">
              <div>
                <p className="text-sm text-slate-500">
                  Characters: {answer.length}
                </p>
                <p className="text-sm text-slate-500">
                  Status: {listening ? "Listening to your answer..." : "Not recording"}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={startVoiceAnswer}
                  className="bg-indigo-600 text-white px-7 py-3 rounded-xl font-semibold hover:bg-indigo-700 inline-flex items-center justify-center gap-2"
                >
                  <Radio size={18} />
                  Start Speaking
                </button>

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
                      Voice interview focus:
                    </p>

                    <ul className="text-sm text-blue-900 space-y-2">
                      <li>• Speak in complete sentences</li>
                      <li>• Avoid repeated filler words</li>
                      <li>• Mention tools, example, and impact</li>
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
                    Based on answer length, clarity, and filler words.
                  </p>
                </div>
              </div>
            )}

            {completed && (
              <div className="mt-8 bg-slate-950 text-white rounded-3xl p-8">
                <h3 className="text-3xl font-bold">
                  Voice interview completed
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
