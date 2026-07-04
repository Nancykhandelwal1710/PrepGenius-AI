import { useState } from "react";
import axios from "axios";

const API_URL = "https://prepgenius-backend-3841.onrender.com";

function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [atsScore, setAtsScore] = useState(null);
  const [matchedSkills, setMatchedSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [jobDomain, setJobDomain] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
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
    setRequiredSkills([]);
    setJobDomain("");
    setExperienceLevel("");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setLoading(true);

      const response = await axios.post(`${API_URL}/extract-text`, formData);

      setText(response.data.text);
      localStorage.setItem("resumeText", response.data.text);
    } catch (error) {
      console.error(error);
      setText("Could not read this PDF. Try uploading a text-based resume PDF.");
    } finally {
      setLoading(false);
    }
  };

  const analyzeResume = async () => {
    if (!jobDescription.trim()) {
      alert("Please paste a job description first.");
      return;
    }

    try {
      setAnalyzing(true);

      const atsResponse = await axios.post(`${API_URL}/ats-score`, {
        resume_text: text,
        job_description: jobDescription,
      });

      setAtsScore(atsResponse.data.ats_score);
      setMatchedSkills(atsResponse.data.matched_skills || []);
      setMissingSkills(atsResponse.data.missing_skills || []);
      setRequiredSkills(atsResponse.data.required_skills || []);
      setJobDomain(atsResponse.data.job_domain || "");
      setExperienceLevel(atsResponse.data.experience_level || "");

      localStorage.setItem("atsScore", atsResponse.data.ats_score);
      localStorage.setItem(
        "matchedSkills",
        JSON.stringify(atsResponse.data.matched_skills || [])
      );
      localStorage.setItem(
        "missingSkills",
        JSON.stringify(atsResponse.data.missing_skills || [])
      );

      const suggestionResponse = await axios.post(`${API_URL}/suggestions`, {
        resume_text: text,
        job_description: jobDescription,
      });

      setSuggestions(suggestionResponse.data.suggestions || []);
    } catch (error) {
      console.error(error);
      alert("Analysis failed. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-slate-950 text-white rounded-3xl shadow-lg p-8 mb-8">
          <p className="text-sm uppercase tracking-widest text-blue-300 mb-3">
            Resume Check
          </p>

          <h1 className="text-4xl md:text-5xl font-bold">
            Check how well your resume fits a target role
          </h1>

          <p className="text-slate-300 mt-4 max-w-3xl leading-7">
            Upload your resume, paste the job description, and see what matches,
            what is missing, and what you can improve before applying.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-3xl shadow p-8">
            <p className="text-sm text-blue-600 font-semibold mb-2">
              Step 1
            </p>

            <h2 className="text-2xl font-bold mb-3">
              Upload your resume
            </h2>

            <p className="text-slate-600 text-sm mb-5">
              Use a PDF resume that contains selectable text. Scanned image PDFs
              may not extract properly.
            </p>

            <input
              type="file"
              accept=".pdf"
              onChange={handleUpload}
              className="block w-full text-sm border border-dashed border-slate-300 rounded-xl p-4"
            />

            {file && (
              <div className="mt-5 bg-slate-50 border rounded-xl p-4">
                <p className="text-sm text-slate-500">Selected file</p>
                <p className="font-medium text-slate-800">{file.name}</p>
              </div>
            )}

            {loading && (
              <p className="mt-5 text-blue-600 font-medium">
                Reading your resume...
              </p>
            )}
          </div>

          <div className="bg-white rounded-3xl shadow p-8">
            <p className="text-sm text-blue-600 font-semibold mb-2">
              Step 2
            </p>

            <h2 className="text-2xl font-bold mb-3">
              Paste the job description
            </h2>

            <p className="text-slate-600 text-sm mb-5">
              Add the role requirements here so the tool can compare them with
              your resume.
            </p>

            <textarea
              rows="9"
              className="w-full border border-slate-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />

            <button
              onClick={analyzeResume}
              disabled={!text || analyzing}
              className="mt-5 w-full bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:bg-slate-400"
            >
              {analyzing ? "Checking resume..." : "Check Resume Fit"}
            </button>
          </div>
        </div>

        {text && (
          <div className="bg-white rounded-3xl shadow p-8 mb-8">
            <h2 className="text-2xl font-bold mb-3">
              Extracted resume text
            </h2>

            <p className="text-sm text-slate-600 mb-4">
              This is the text read from your PDF. It may look slightly different
              from the original layout, but it is used for analysis.
            </p>

            <textarea
              rows="10"
              className="w-full border border-slate-300 rounded-xl p-4 bg-slate-50 text-sm"
              value={text}
              readOnly
            />
          </div>
        )}

        {atsScore !== null && (
          <div className="bg-white rounded-3xl shadow p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <p className="text-sm text-blue-600 font-semibold">
                  Result
                </p>

                <h2 className="text-3xl font-bold">
                  Resume Fit Score: {atsScore}%
                </h2>
              </div>

              <div className="bg-slate-100 px-5 py-3 rounded-xl text-sm text-slate-700">
                Based on skills found in the job description
              </div>
            </div>

            <div className="w-full bg-slate-200 rounded-full h-5 mb-8 overflow-hidden">
              <div
                className="h-5 bg-green-500 rounded-full"
                style={{ width: `${atsScore}%` }}
              />
            </div>

            {jobDomain && (
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
                  <p className="text-sm text-indigo-500">Detected domain</p>
                  <p className="font-semibold text-indigo-900">{jobDomain}</p>
                </div>

                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
                  <p className="text-sm text-indigo-500">Experience level</p>
                  <p className="font-semibold text-indigo-900">
                    {experienceLevel}
                  </p>
                </div>
              </div>
            )}

            <div className="grid lg:grid-cols-3 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-indigo-700">
                  Required skills
                </h3>

                <div className="flex flex-wrap gap-3">
                  {requiredSkills.length > 0 ? (
                    requiredSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-lg text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">
                      No required skills detected.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-green-700">
                  Skills already present
                </h3>

                <div className="flex flex-wrap gap-3">
                  {matchedSkills.length > 0 ? (
                    matchedSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">
                      No matching skills found.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-red-700">
                  Skills to improve
                </h3>

                <div className="flex flex-wrap gap-3">
                  {missingSkills.length > 0 ? (
                    missingSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-red-100 text-red-800 px-4 py-2 rounded-lg text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">
                      No missing skills found for this job description.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-xl font-semibold mb-4 text-blue-700">
                What to improve in your resume
              </h3>

              <div className="space-y-3">
                {suggestions.length > 0 ? (
                  suggestions.map((item, index) => (
                    <div
                      key={index}
                      className="bg-blue-50 border border-blue-100 text-blue-900 p-4 rounded-xl text-sm leading-6"
                    >
                      {item}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">
                    No suggestions available yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResumeAnalyzer;
