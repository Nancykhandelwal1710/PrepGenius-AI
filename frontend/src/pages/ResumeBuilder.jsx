import { useState } from "react";
import axios from "axios";
import {
  Upload,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  FileText,
  Copy,
} from "lucide-react";

const API_URL = "https://prepgenius-backend-3841.onrender.com";

function ResumeBuilder() {
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState(
    localStorage.getItem("resumeText") || ""
  );
  const [jobDescription, setJobDescription] = useState("");

  const [extracting, setExtracting] = useState(false);
  const [tailoring, setTailoring] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleUpload = async (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setResult(null);
    setError("");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setExtracting(true);

      const response = await axios.post(
        `${API_URL}/extract-text`,
        formData
      );

      const extractedText = response.data.text || "";

      setResumeText(extractedText);
      localStorage.setItem("resumeText", extractedText);
    } catch (uploadError) {
      console.error(uploadError);
      setError(
        "The resume could not be read. Upload a text-based PDF and try again."
      );
    } finally {
      setExtracting(false);
    }
  };

  const tailorResume = async () => {
    if (!resumeText.trim()) {
      setError("Upload a resume or paste your resume text first.");
      return;
    }

    if (!jobDescription.trim()) {
      setError("Paste the target job description first.");
      return;
    }

    try {
      setTailoring(true);
      setResult(null);
      setError("");

      const response = await axios.post(
        `${API_URL}/tailor-resume`,
        {
          resume_text: resumeText,
          job_description: jobDescription,
        }
      );

      if (response.data.error) {
        setError(response.data.error);
        return;
      }

      setResult(response.data);
    } catch (requestError) {
      console.error(requestError);
      setError(
        "The tailored resume could not be generated. Please try again."
      );
    } finally {
      setTailoring(false);
    }
  };

  const copyText = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
    } catch (copyError) {
      console.error(copyError);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="max-w-7xl mx-auto">
        <section className="bg-slate-950 text-white rounded-3xl p-8 md:p-10 shadow-xl mb-8">
          <p className="text-sm uppercase tracking-widest text-blue-300 mb-3">
            AI Resume Tailor
          </p>

          <h1 className="text-4xl md:text-5xl font-bold max-w-4xl">
            Tailor your existing resume for a specific job
          </h1>

          <p className="text-slate-300 mt-4 max-w-3xl leading-7">
            Upload your resume and add a job description. PrepGenius will
            rewrite relevant content without inventing experience or skills.
          </p>
        </section>

        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-800 rounded-2xl p-5">
            {error}
          </div>
        )}

        <section className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-3xl shadow p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Upload size={22} />
              </div>

              <div>
                <p className="text-sm text-blue-600 font-semibold">
                  Step 1
                </p>
                <h2 className="text-2xl font-bold">
                  Add your current resume
                </h2>
              </div>
            </div>

            <input
              type="file"
              accept=".pdf"
              onChange={handleUpload}
              className="w-full border border-dashed border-slate-300 rounded-xl p-4 text-sm"
            />

            {file && (
              <div className="mt-4 bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500">
                  Selected resume
                </p>
                <p className="font-medium">{file.name}</p>
              </div>
            )}

            {extracting && (
              <p className="mt-4 text-sm text-blue-600 font-medium">
                Reading resume...
              </p>
            )}

            <label className="block text-sm font-semibold mt-6 mb-2">
              Resume text
            </label>

            <textarea
              rows="13"
              value={resumeText}
              onChange={(event) => setResumeText(event.target.value)}
              placeholder="Upload a PDF or paste your resume text here."
              className="w-full border border-slate-300 rounded-xl p-4 text-sm"
            />
          </div>

          <div className="bg-white rounded-3xl shadow p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FileText size={22} />
              </div>

              <div>
                <p className="text-sm text-blue-600 font-semibold">
                  Step 2
                </p>
                <h2 className="text-2xl font-bold">
                  Add the target job
                </h2>
              </div>
            </div>

            <p className="text-sm text-slate-600 mb-5 leading-6">
              Paste the complete job description so the system can understand
              the role, required skills, and important keywords.
            </p>

            <textarea
              rows="18"
              value={jobDescription}
              onChange={(event) =>
                setJobDescription(event.target.value)
              }
              placeholder="Paste the job description here..."
              className="w-full border border-slate-300 rounded-xl p-4 text-sm"
            />

            <button
              type="button"
              onClick={tailorResume}
              disabled={tailoring || extracting}
              className="mt-5 w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 disabled:bg-slate-400 inline-flex justify-center items-center gap-2"
            >
              <Sparkles size={20} />
              {tailoring
                ? "Tailoring your resume..."
                : "Tailor My Resume"}
            </button>
          </div>
        </section>

        {result && (
          <section className="space-y-8">
            <div className="bg-white rounded-3xl shadow p-8">
              <p className="text-sm text-blue-600 font-semibold">
                Target role
              </p>

              <h2 className="text-3xl font-bold mt-1">
                {result.target_role || "Role detected from job description"}
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-3xl shadow p-8">
                <div className="flex justify-between gap-4 mb-4">
                  <div>
                    <p className="text-sm text-blue-600 font-semibold">
                      Tailored content
                    </p>
                    <h2 className="text-2xl font-bold">
                      Professional summary
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyText(result.summary || "")}
                    className="text-slate-500 hover:text-blue-600"
                    aria-label="Copy tailored summary"
                  >
                    <Copy size={20} />
                  </button>
                </div>

                <textarea
                  rows="8"
                  value={result.summary || ""}
                  onChange={(event) =>
                    setResult({
                      ...result,
                      summary: event.target.value,
                    })
                  }
                  className="w-full border border-slate-300 rounded-xl p-4 text-sm"
                />
              </div>

              <div className="bg-white rounded-3xl shadow p-8">
                <h2 className="text-2xl font-bold mb-2">
                  Relevant skills
                </h2>

                <p className="text-sm text-slate-600 mb-5">
                  Only skills supported by your original resume are included.
                </p>

                <div className="flex flex-wrap gap-3">
                  {(result.skills || []).map((skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <ListCard
                title="Tailored project points"
                items={result.projects}
                positive
              />

              <ListCard
                title="Tailored experience points"
                items={result.experience}
                positive
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-3xl shadow p-8">
                <div className="flex items-center gap-3 mb-5">
                  <CheckCircle className="text-green-600" />
                  <h2 className="text-2xl font-bold">
                    Matched keywords
                  </h2>
                </div>

                <div className="flex flex-wrap gap-3">
                  {(result.keywords || []).map((keyword, index) => (
                    <span
                      key={`${keyword}-${index}`}
                      className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow p-8">
                <div className="flex items-center gap-3 mb-5">
                  <AlertTriangle className="text-amber-600" />
                  <h2 className="text-2xl font-bold">
                    Unsupported requirements
                  </h2>
                </div>

                <p className="text-sm text-slate-600 mb-5">
                  Do not add these unless you genuinely have the required
                  knowledge or experience.
                </p>

                <div className="flex flex-wrap gap-3">
                  {(result.missing_keywords || []).map(
                    (keyword, index) => (
                      <span
                        key={`${keyword}-${index}`}
                        className="bg-amber-100 text-amber-800 px-4 py-2 rounded-lg text-sm"
                      >
                        {keyword}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>

            <ListCard
              title="What to improve before applying"
              items={result.suggestions}
            />
          </section>
        )}
      </div>
    </div>
  );
}

function ListCard({ title, items = [], positive = false }) {
  return (
    <div className="bg-white rounded-3xl shadow p-8">
      <h2 className="text-2xl font-bold mb-5">{title}</h2>

      {items.length > 0 ? (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={`${index}-${item}`}
              className={
                positive
                  ? "bg-green-50 border border-green-100 rounded-xl p-4 text-sm leading-6"
                  : "bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm leading-6"
              }
            >
              {item}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">
          No supported content was found for this section.
        </p>
      )}
    </div>
  );
}

export default ResumeBuilder;
