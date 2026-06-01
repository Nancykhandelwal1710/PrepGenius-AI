import { useState } from "react";

function MockInterview() {
  const [role, setRole] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(null);

  const generateQuestions = () => {
    const sampleQuestions = [
      `Tell me about yourself for a ${role} role.`,
      "What are your strongest technical skills?",
      "Explain one project you have built.",
      "What challenges did you face in your project?",
      "Why should we hire you?"
    ];

    setQuestions(sampleQuestions);
    setCurrentIndex(0);
    setAnswer("");
    setFeedback("");
    setScore(null);
  };

  const submitAnswer = () => {
    if (answer.length < 30) {
      setFeedback("Your answer is too short. Add more explanation, examples, and confidence.");
      setScore(4);
    } else if (answer.length < 100) {
      setFeedback("Good start. Improve by adding project examples and measurable impact.");
      setScore(7);
    } else {
      setFeedback("Strong answer. You explained clearly and added enough detail.");
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
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-3">AI Mock Interview</h1>
        <p className="text-gray-600 mb-8">
          Practice interview questions and receive instant feedback.
        </p>

        <div className="mb-8">
          <label className="block font-semibold mb-2">Job Role</label>
          <input
            type="text"
            placeholder="Example: AI/ML Engineer"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-4"
          />

          <button
            onClick={generateQuestions}
            className="mt-4 bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700"
          >
            Start Interview
          </button>
        </div>

        {questions.length > 0 && (
          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold mb-4">
              Question {currentIndex + 1}
            </h2>

            <p className="text-lg mb-4">
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
              className="mt-4 bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700"
            >
              Submit Answer
            </button>

            {feedback && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-5">
                <h3 className="text-xl font-bold mb-2">Feedback</h3>
                <p className="mb-2">{feedback}</p>
                <p className="font-semibold">Score: {score}/10</p>
              </div>
            )}

            {feedback && currentIndex < questions.length - 1 && (
              <button
                onClick={nextQuestion}
                className="mt-4 bg-gray-800 text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-900"
              >
                Next Question
              </button>
            )}

            {feedback && currentIndex === questions.length - 1 && (
              <p className="mt-6 text-green-700 font-semibold">
                Interview completed!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MockInterview;
