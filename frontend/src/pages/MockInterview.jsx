import { useState } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

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
          role: role,
          resume_text: resumeText,
          job_description: jobDescription,
        }
      );

      setQuestions(response.data.questions);
    } catch (error) {
      console.error(error);
      alert("Error generating interview questions");
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = () => {
    if (answer.length < 30) {
      setFeedback(
        "Your answer is too short. Add more explanation, examples, and confidence."
      );
      setScore(4);
    } else if (answer.length < 100) {
      setFeedback(
        "Good start. Improve by adding project examples and measurable impact."
      );
      setScore(7);
    } else {
      setFeedback(
        "Strong answer. You explained clearly and added enough detail."
      );
      setScore(9);
    }
  };

  const nextQuestion = () => {
    setCurrentIndex(currentIndex + 1);
    setAnswer("");
    setFeedback("");
    setScore(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900">
            AI Mock Interview
          </h1>

          <p className="text-xl text-gray-600 mt-3">
            Generate personalized interview questions using Gemini AI
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold mb-5">
            Interview Setup
          </h2>

          <label className="block font-semibold mb-2">
            Job Role
          </label>

          <input
            type="text"
            placeholder="Example: AI/ML Engineer"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-4 mb-5"
          />

          <label className="block font-semibold mb-2">
            Resume Text
          </label>

          <textarea
            rows="6"
            placeholder="Paste resume text here..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-4 mb-5"
          />

          <label className="block font-semibold mb-2">
            Job Description
          </label>

          <textarea
            rows="6"
            placeholder="Paste job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-4 mb-5"
          />

          <button
            onClick={generateQuestions}
            disabled={loading}
            className="bg-blue-600 text-white px-10 py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? "Generating Questions..." : "Generate Questions"}
          </button>
        </div>

        {questions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-5">
              Question {currentIndex + 1} of {questions.length}
            </h2>

            <p className="text-lg bg-gray-50 border rounded-xl p-5 mb-5">
              {questions[currentIndex]}
            </p>

            <textarea
              rows="8"
              placeholder="Type your answer here..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-4"
            />

            <button
              onClick={submitAnswer}
              className="mt-4 bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
            >
              Submit Answer
            </button>

            {feedback && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-5">
                <h3 className="text-2xl font-bold mb-2">
                  Feedback
                </h3>

                <p className="mb-2">
                  {feedback}
                </p>

                <p className="font-semibold">
                  Score: {score}/10
                </p>
              </div>
            )}

            {feedback && currentIndex < questions.length - 1 && (
              <button
                onClick={nextQuestion}
                className="mt-5 bg-gray-800 text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-900 transition"
              >
                Next Question
              </button>
            )}

            {feedback && currentIndex === questions.length - 1 && (
              <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-5">
                <h3 className="text-2xl font-bold text-green-700">
                  Interview Completed!
                </h3>

                <p className="text-gray-700 mt-2">
                  You have completed all generated interview questions.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MockInterview;
