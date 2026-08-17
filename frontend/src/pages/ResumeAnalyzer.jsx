import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

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
  const [health, setHealth] = useState(null);
  const [error, setError] = useState("");
  const [optimizing, setOptimizing] = useState(false);

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

  const optimizePDF = async () => {
    if (!file) {
      setError("Please upload your original PDF resume first.");
      return;
    }

    if (!jobDescription.trim()) {
      setError("Please paste the target job description first.");
      return;
    }

    try {
      setOptimizing(true);
      setError("");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("job_description", jobDescription);

      const response = await axios.post(
        `${API_URL}/optimize-pdf`, 
        formData, 
        {
          responseType: "blob",
        }
      );

      const pdfBlob = new Blob([response.data], {
        type: "application/pdf",
      });

      const downloadUrl = window.URL.createObjectURL(pdfBlob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `optimized_${file.name}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      window.URL.revokeObjectURL(downloadUrl);
    } catch (requestError) {
      console.error(requestError);
      
      let message =
        "The optimized PDF could not be generated. Please try again.";

      if (requestError.response?.data instanceof Blob) {
        try{
          const errorText = await requestError.response.data.text();
          const parsedError = JSON.parse(errorText);

          message =
            parsedError.detail ||
            parsedError.error ||
            message;
        } catch {
          // Keep the default error message.
        }
      }

      setError(message);
    } finally {
      setOptimizing(false);
    }
  };

  const analyzeResume = async () => {
    if (!jobDescription.trim()) {
      alert("Please paste a job description first.");
      return;
    }

    try {
      setAnalyzing(true);

      // 1. ATS ANALYSIS
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

      localStorage.setItem(
        "atsScore",
        atsResponse.data.ats_score
      );

      localStorage.setItem(
        "matchedSkills",
        JSON.stringify(atsResponse.data.matched_skills || [])
      );

      localStorage.setItem(
        "missingSkills",
        JSON.stringify(atsResponse.data.missing_skills || [])
      );

      // 2. RESUME HEALTH
      try {
        const healthResponse = await axios.post(
          `${API_URL}/resume-health`,
          {
            resume_text: text,
            ats_score: atsResponse.data.ats_score,
            matched_skills: atsResponse.data.matched_skills || [],
            missing_skills: atsResponse.data.missing_skills || [],
          }
        );

        setHealth(healthResponse.data);

      } catch (healthError) {
        console.error("Resume Health failed:", healthError);
        setHealth(null);
      }

      // 3. RESUME SUGGESTIONS
      try {
        const suggestionResponse = await axios.post(
          `${API_URL}/resume-suggestions`,
          {
            resume_text: text,
            job_description: jobDescription,
          }
        );
        setSuggestions(
          suggestionResponse.data.suggestions || []
        );

      } catch (suggestionError) {
        console.error(
          "Resume Suggestions failed:",
          suggestionError
        );

        setSuggestions([]);
      }

    } catch (error) {
      console.error("ATS Analysis failed:", error);
      alert("ATS analysis failed. Please try again.");

    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFAF6] text-[#14213D] px-4 sm:px-6 py-8 md:py-10">
      <div className="max-w-7xl mx-auto">

        {/* Hero */}
        <section className="relative overflow-hidden bg-[#2457D6] text-white border-2 border-[#14213D] p-7 md:p-10 shadow-[8px_8px_0_#14213D]">
          <div className="absolute -right-8 -top-12 text-[10rem] font-black text-white/5 leading-none">✦</div>
          <div className="absolute right-8 bottom-5 text-5xl text-[#B8E34B] rotate-12">↗</div>

          <div className="relative max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#B8E34B]">
              Resume Analyzer
            </p>
            <h1 className="mt-3 text-4xl md:text-6xl font-black tracking-[-0.055em] leading-[0.95]">
              Find out where your resume stands.
            </h1>
            <p className="mt-5 text-white/75 text-base md:text-lg leading-7 max-w-3xl">
              Match your resume against a real role, spot the gaps, and get practical
              suggestions before you hit Apply.
            </p>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="mt-6 bg-[#FFF0EC] border-2 border-[#FF6B57] p-4 text-[#14213D] font-semibold">
            {error}
          </div>
        )}

        {/* Input flow */}
        <section className="grid lg:grid-cols-2 gap-6 mt-8">
          <div className="bg-white border-2 border-[#14213D] p-7 md:p-8 shadow-[6px_6px_0_#B8E34B]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-serif italic text-[#2457D6]">01 / Your resume</p>
                <h2 className="mt-1 text-3xl font-black tracking-[-0.04em]">
                  Drop it here.
                </h2>
              </div>
              <span className="text-4xl">📄</span>
            </div>

            <p className="mt-4 text-sm leading-6 text-[#14213D]/55">
              Upload a text-based PDF. Scanned image PDFs may not extract correctly.
            </p>

            <label className="mt-6 block cursor-pointer border-2 border-dashed border-[#2457D6]/35 bg-[#EDF3FF] p-7 hover:bg-[#E4EDFF] transition-colors">
              <input
                type="file"
                accept=".pdf"
                onChange={handleUpload}
                className="hidden"
              />
              <div className="text-center">
                <div className="text-4xl">↑</div>
                <p className="mt-3 font-black text-lg">
                  {file ? "Choose another PDF" : "Choose your resume PDF"}
                </p>
                <p className="mt-1 text-xs text-[#14213D]/50">
                  PDF only
                </p>
              </div>
            </label>

            {file && (
              <div className="mt-5 flex items-center justify-between gap-4 bg-[#F7F9F0] border border-[#B8E34B] p-4">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wider font-black text-[#14213D]/45">
                    Selected file
                  </p>
                  <p className="mt-1 font-bold truncate">{file.name}</p>
                </div>
                <span className="text-xl">✓</span>
              </div>
            )}

            {loading && (
              <div className="mt-5 flex items-center gap-3 text-[#2457D6] font-bold">
                <span className="animate-pulse">●</span>
                Reading your resume...
              </div>
            )}
          </div>

          <div className="bg-[#14213D] text-white border-2 border-[#14213D] p-7 md:p-8 shadow-[6px_6px_0_#FF6B57]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-serif italic text-[#B8E34B]">02 / Target role</p>
                <h2 className="mt-1 text-3xl font-black tracking-[-0.04em]">
                  Tell us what you're applying for.
                </h2>
              </div>
              <span className="text-4xl">🎯</span>
            </div>

            <textarea
              rows="9"
              className="mt-6 w-full bg-white text-[#14213D] border-2 border-white/20 p-4 focus:outline-none focus:border-[#B8E34B] resize-y"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />

            <button
              onClick={analyzeResume}
              disabled={!text || analyzing}
              className="mt-5 w-full bg-[#B8E34B] text-[#14213D] px-6 py-4 font-black text-base hover:bg-white transition-colors disabled:bg-white/20 disabled:text-white/40 disabled:cursor-not-allowed"
            >
              {analyzing ? "Checking your fit..." : "Check my resume fit →"}
            </button>
          </div>
        </section>

        {/* Extracted text */}
        {text && (
          <section className="mt-8 bg-white border-2 border-[#14213D]/10 p-7 md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-serif italic text-[#2457D6]">Under the hood</p>
                <h2 className="mt-1 text-2xl md:text-3xl font-black">
                  What we read from your PDF
                </h2>
              </div>
              <span className="hidden sm:block text-3xl">⌁</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-[#14213D]/50">
              This extracted text is what the analyzer uses. It may look different from
              your original PDF layout.
            </p>
            <textarea
              rows="10"
              className="mt-5 w-full border border-[#14213D]/10 p-4 bg-[#F7F8FA] text-sm text-[#14213D]/70"
              value={text}
              readOnly
            />
          </section>
        )}

        {/* Results */}
        {atsScore !== null && (
          <section className="mt-8 space-y-6">

            {/* Score */}
            <div className="bg-white border-2 border-[#14213D] p-7 md:p-9 shadow-[7px_7px_0_#2457D6]">
              <div className="grid md:grid-cols-[260px_1fr] gap-8 items-center">
                <div className="bg-[#EDF3FF] border-2 border-[#2457D6]/15 p-7 text-center">
                  <p className="text-xs font-black uppercase tracking-wider text-[#2457D6]">
                    Resume fit
                  </p>
                  <div className="mt-2 text-7xl font-black tracking-[-0.07em] text-[#2457D6]">
                    {atsScore}
                  </div>
                  <p className="text-sm font-bold text-[#14213D]/40">out of 100</p>
                </div>

                <div>
                  <p className="text-sm font-serif italic text-[#2457D6]">
                    Your first read
                  </p>
                  <h2 className="mt-1 text-3xl md:text-4xl font-black tracking-[-0.045em]">
                    {atsScore >= 80
                      ? "You're looking like a strong match."
                      : atsScore >= 60
                      ? "You're on the way. A few gaps stand out."
                      : "There's work to do before you apply."}
                  </h2>

                  <div className="mt-6 h-4 bg-[#E6EAF1] overflow-hidden">
                    <div
                      className="h-full bg-[#2457D6] transition-all"
                      style={{ width: `${atsScore}%` }}
                    />
                  </div>

                  {(jobDomain || experienceLevel) && (
                    <div className="flex flex-wrap gap-3 mt-5">
                      {jobDomain && (
                        <span className="bg-[#F1F7D9] border border-[#B8E34B] px-4 py-2 text-sm font-bold">
                          {jobDomain}
                        </span>
                      )}
                      {experienceLevel && (
                        <span className="bg-[#FFF0EC] border border-[#FF6B57]/30 px-4 py-2 text-sm font-bold">
                          {experienceLevel}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      onClick={optimizePDF}
                      disabled={!file || !jobDescription.trim() || optimizing}
                      className="bg-[#14213D] text-white px-5 py-3 rounded-xl font-black hover:bg-[#2457D6] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {optimizing ? "Optimizing..." : "Optimize PDF ↗"}
                    </button>
                    <p className="self-center text-xs text-[#14213D]/45">
                      Downloads an optimized copy of your original PDF.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Health */}
            {health && (
              <div className="bg-[#EEF3FF] border-2 border-[#14213D]/10 p-7 md:p-8">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-serif italic text-[#2457D6]">Resume health</p>
                    <h2 className="mt-1 text-3xl font-black">The details behind the score.</h2>
                  </div>
                  <div className="text-4xl font-black text-[#2457D6]">{health.overall}/100</div>
                </div>

                <div className="mt-7 grid md:grid-cols-2 gap-x-8 gap-y-6">
                  {[
                    ["ATS Compatibility", health.ats],
                    ["Summary", health.summary],
                    ["Experience / Projects", health.experience],
                    ["Skills", health.skills],
                    ["Grammar", health.grammar],
                    ["Action Verbs", health.action_verbs],
                    ["Achievements", health.achievements],
                  ].map(([title, value]) => (
                    <div key={title}>
                      <div className="flex justify-between gap-4 text-sm font-bold">
                        <span>{title}</span>
                        <span className="text-[#2457D6]">{value ?? 0}%</span>
                      </div>
                      <div className="mt-2 h-3 bg-white overflow-hidden">
                        <div
                          className="h-full bg-[#2457D6]"
                          style={{ width: `${value || 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {health.feedback?.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-black">Quick fixes worth making</h3>
                    <div className="mt-4 grid md:grid-cols-2 gap-3">
                      {health.feedback.map((item, index) => (
                        <div
                          key={index}
                          className="bg-white border-l-4 border-[#FF6B57] p-4 text-sm leading-6"
                        >
                          <span className="font-black text-[#FF6B57] mr-2">0{index + 1}</span>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Skills */}
            <div className="grid lg:grid-cols-3 gap-5">
              <div className="bg-white border-2 border-[#14213D]/10 p-7">
                <p className="text-sm font-serif italic text-[#2457D6]">The target asks for</p>
                <h3 className="mt-1 text-2xl font-black">Required skills</h3>
                <div className="flex flex-wrap gap-2 mt-6">
                  {requiredSkills.length > 0 ? requiredSkills.map((skill, index) => (
                    <span key={index} className="bg-[#EDF3FF] text-[#2457D6] border border-[#2457D6]/15 px-3 py-2 rounded-full text-sm font-bold">
                      {skill}
                    </span>
                  )) : <p className="text-sm text-[#14213D]/45">No required skills detected.</p>}
                </div>
              </div>

              <div className="bg-[#F1F7D9] border-2 border-[#B8E34B] p-7">
                <p className="text-sm font-serif italic text-[#648400]">Already covered</p>
                <h3 className="mt-1 text-2xl font-black">Your matches</h3>
                <div className="flex flex-wrap gap-2 mt-6">
                  {matchedSkills.length > 0 ? matchedSkills.map((skill, index) => (
                    <span key={index} className="bg-white text-[#526B00] border border-[#B8E34B]/60 px-3 py-2 rounded-full text-sm font-bold">
                      ✓ {skill}
                    </span>
                  )) : <p className="text-sm text-[#14213D]/45">No matching skills found.</p>}
                </div>
              </div>

              <div className="bg-[#FFF0EC] border-2 border-[#FF6B57]/40 p-7">
                <p className="text-sm font-serif italic text-[#D94A39]">Your next opportunity</p>
                <h3 className="mt-1 text-2xl font-black">Skills to improve</h3>
                <div className="flex flex-wrap gap-2 mt-6">
                  {missingSkills.length > 0 ? missingSkills.map((skill, index) => (
                    <span key={index} className="bg-white text-[#C83E2F] border border-[#FF6B57]/30 px-3 py-2 rounded-full text-sm font-bold">
                      + {skill}
                    </span>
                  )) : <p className="text-sm text-[#14213D]/45">No missing skills found.</p>}
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-[#14213D] text-white border-2 border-[#14213D] p-7 md:p-8 shadow-[6px_6px_0_#B8E34B]">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-sm font-serif italic text-[#B8E34B]">Make the next edit count</p>
                  <h2 className="mt-1 text-3xl font-black">What to improve in your resume</h2>
                </div>
                <span className="text-3xl">✎</span>
              </div>

              <div className="mt-6 grid md:grid-cols-2 gap-3">
                {suggestions.length > 0 ? suggestions.map((item, index) => (
                  <div key={index} className="bg-white/10 border border-white/10 p-4 text-sm leading-6">
                    <span className="text-[#B8E34B] font-black mr-2">→</span>
                    {item}
                  </div>
                )) : (
                  <p className="text-white/50 text-sm">No suggestions available yet.</p>
                )}
              </div>
            </div>
          </section>
        )}

        {!atsScore && !file && (
          <div className="mt-10 grid md:grid-cols-3 gap-4">
            {[
              ["Upload", "Give PrepGenius your latest resume.", "📄"],
              ["Compare", "Add the job you're targeting.", "🎯"],
              ["Improve", "Use the gaps to make your next version stronger.", "✦"],
            ].map(([title, desc, icon]) => (
              <div key={title} className="bg-white border border-[#14213D]/10 p-6">
                <span className="text-3xl">{icon}</span>
                <h3 className="mt-5 text-xl font-black">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#14213D]/55">{desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function HealthBar({ title, value }) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="font-medium">{title}</span>
        <span className="font-semibold">{value ?? 0}%</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-3">
        <div
          className="bg-blue-600 h-3 rounded-full"
          style={{ width: `${value || 0}%` }}
        />
      </div>
    </div>
  );
}

export default ResumeAnalyzer;
