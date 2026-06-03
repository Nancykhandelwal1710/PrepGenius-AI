import { useState } from "react";
import axios from "axios";

const API_URL = "https://prepgenius-backend-3841.onrender.com";

function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [atsScore, setAtsScore] = useState(null);
  const [matchedSkills, setMatchedSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const handleUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setText("");
    setAtsScore(null);
    setMatchedSkills([]);
    setMissingSkills([]);
    setSuggestions([]);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/extract-text`,
        formData
      );

      setText(response.data.text);
      localStorage.setItem("resumeText", response.data.text);
    } catch (error) {
      console.error(error);
      setText("Error extracting resume text. Please check if the PDF is text-based and try again.");
    } finally {
      setLoading(false);
    }
  };

  const analyzeResume = async () => {
    try {
      const atsResponse = await axios.post(
        `${API_URL}/ats-score`,
        {
          resume_text: text,
          job_description: jobDescription,
        }
      );

      setAtsScore(atsResponse.data.ats_score);
      setMatchedSkills(atsResponse.data.matched_skills);
      setMissingSkills(atsResponse.data.missing_skills);
      localStorage.setItem("atsScore", atsResponse.data.ats_score);
      localStorage.setItem(
        "matchedSkills",
          JSON.stringify(atsResponse.data.matched_skills)
      );
      localStorage.setItem(
        "missingSkills",
        JSON.stringify(atsResponse.data.missing_skills)
     );
      const suggestionResponse = await axios.post(
        `${API_URL}/suggestions`,
        {
          resume_text: text,
          job_description: jobDescription,
        }
      );

      setSuggestions(suggestionResponse.data.suggestions);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900">PrepGenius AI</h1>
          <p className="text-xl text-gray-600 mt-3">
            AI-Powered Resume Analyzer
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold mb-5">Upload Resume</h2>

          <input
            type="file"
            accept=".pdf"
            onChange={handleUpload}
            className="block w-full text-lg"
          />

          {file && (
            <div className="mt-5 bg-gray-50 border rounded-xl p-4">
              <p className="font-semibold">Uploaded File:</p>
              <p className="text-gray-700">{file.name}</p>
            </div>
          )}

          {loading && (
            <p className="mt-5 text-blue-600 font-medium">
              Extracting resume text...
            </p>
          )}
        </div>

        {text && (
          <>
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-3xl font-bold mb-5">Job Description</h2>

              <textarea
                rows="8"
                className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Paste Job Description Here"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            <div className="text-center mb-8">
              <button
                onClick={analyzeResume}
                className="bg-blue-600 text-white px-10 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                Analyze Resume
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-3xl font-bold mb-5">
                Extracted Resume Text
              </h2>

              <textarea
                rows="12"
                className="w-full border border-gray-300 rounded-xl p-4 bg-gray-50"
                value={text}
                readOnly
              />
            </div>
          </>
        )}

        {atsScore !== null && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-5">ATS Score: {atsScore}%</h2>

            <div className="w-full bg-gray-200 rounded-full h-6 mb-8 overflow-hidden">
              <div
                className="h-6 bg-green-500 rounded-full"
                style={{ width: `${atsScore}%` }}
              />
            </div>

            <h3 className="text-2xl font-semibold mb-4 text-green-700">
              Matched Skills
            </h3>

            <div className="flex flex-wrap gap-3 mb-8">
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
                <p>No matched skills found.</p>
              )}
            </div>

            <h3 className="text-2xl font-semibold mb-4 text-red-700">
              Missing Skills
            </h3>

            <div className="flex flex-wrap gap-3 mb-8">
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
                <p>No missing skills.</p>
              )}
            </div>

            <h3 className="text-2xl font-semibold mb-4 text-blue-700">
              AI Suggestions
            </h3>

            <div className="space-y-3">
              {suggestions.length > 0 ? (
                suggestions.map((item, index) => (
                  <div
                    key={index}
                    className="bg-blue-100 text-blue-800 p-4 rounded-lg font-medium"
                  >
                    {item}
                  </div>
                ))
              ) : (
                <p>No suggestions available.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResumeAnalyzer;
