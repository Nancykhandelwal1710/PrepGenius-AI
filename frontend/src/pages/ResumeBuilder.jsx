import { useState } from "react";
import axios from "axios";
import {
  Upload,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  FileText,
} from "lucide-react";

import SummaryCard from "../components/resumeBuilder/SummaryCard";

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
  const [acceptedSummary, setAcceptedSummary] = useState("");

  const handleUpload = async (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setResult(null);
    setAcceptedSummary("");
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
      setAcceptedSummary("");
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
            Upload your resume and add a job description. PrepGenius compares
            the original content with a tailored version without inventing
            experience, skills, or achievements.
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

            <p className="text-sm text-slate-600 mb-5 leading-6">
              Upload a text-based PDF resume or paste the content manually.
            </p>

            <input
              type="file"
              accept=".pdf"
              onChange={handleUpload}
              className="w-full border border-dashed border-slate-300 rounded-xl p-4 text-sm"
            />

            {file && (
              <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="text-xs text-slate-500">
                  Selected resume
                </p>

                <p className="font-medium mt-1">
                  {file.name}
                </p>
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
              className="w-full border border-slate-300 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              Paste the complete job description so PrepGenius can identify
              the role, important skills, and relevant keywords.
            </p>

            <textarea
              rows="18"
              value={jobDescription}
              onChange={(event) =>
                setJobDescription(event.target.value)
              }
              placeholder="Paste the job description here..."
              className="w-full border border-slate-300 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                {result.target_role ||
                  "Role detected from job description"}
              </h2>
            </div>

            <SummaryCard
              summary={result.summary}
              onAccept={setAcceptedSummary}
            />

            {acceptedSummary && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-600" />

                  <div>
                    <p className="font-semibold text-green-900">
                      Professional summary accepted
                    </p>

                    <p className="text-sm text-green-700 mt-1">
                      This version will be used in the final tailored resume.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <SkillsComparison skills={result.skills} />

            <div className="grid lg:grid-cols-2 gap-8">
              <ComparisonListCard
                title="Project improvements"
                description="Compare original project content with the tailored version."
                items={result.projects || []}
              />

              <ComparisonListCard
                title="Experience improvements"
                description="Review how your existing experience has been rewritten."
                items={result.experience || []}
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <KeywordCard
                title="Matched keywords"
                description="These keywords are supported by your resume and the job description."
                items={result.keywords || []}
                type="matched"
              />

              <KeywordCard
                title="Unsupported requirements"
                description="Do not add these unless you genuinely have the skill or experience."
                items={result.missing_keywords || []}
                type="missing"
              />
            </div>

            <ListCard
              title="What to improve before applying"
              items={result.suggestions || []}
            />
          </section>
        )}
      </div>
    </div>
  );
}

function SkillsComparison({ skills }) {
  const originalSkills = skills?.original || [];
  const tailoredSkills = skills?.tailored || [];

  return (
    <div className="bg-white rounded-3xl shadow p-8">
      <div className="mb-6">
        <p className="text-sm text-blue-600 font-semibold mb-1">
          Skills comparison
        </p>

        <h2 className="text-2xl font-bold">
          Relevant skills
        </h2>

        <p className="text-sm text-slate-600 mt-2">
          The tailored version reorders existing skills according to the
          target job.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-4">
            Original skills
          </p>

          <div className="flex flex-wrap gap-3">
            {originalSkills.length > 0 ? (
              originalSkills.map((skill, index) => (
                <span
                  key={`original-${skill}-${index}`}
                  className="bg-slate-200 text-slate-800 px-4 py-2 rounded-lg text-sm font-medium"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-sm text-slate-500">
                No original skills were detected.
              </p>
            )}
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
          <p className="text-xs uppercase tracking-wider text-green-700 font-semibold mb-4">
            Tailored order
          </p>

          <div className="flex flex-wrap gap-3">
            {tailoredSkills.length > 0 ? (
              tailoredSkills.map((skill, index) => (
                <span
                  key={`tailored-${skill}-${index}`}
                  className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-medium"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-sm text-slate-500">
                No tailored skills were generated.
              </p>
            )}
          </div>
        </div>
      </div>

      {skills?.reason && (
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <p className="text-sm font-semibold text-amber-900 mb-1">
            Why the order changed
          </p>

          <p className="text-sm text-amber-800 leading-6">
            {skills.reason}
          </p>
        </div>
      )}
    </div>
  );
}

function ComparisonListCard({
  title,
  description,
  items = [],
}) {
  return (
    <div className="bg-white rounded-3xl shadow p-8">
      <h2 className="text-2xl font-bold mb-2">
        {title}
      </h2>

      <p className="text-sm text-slate-600 mb-6">
        {description}
      </p>

      {items.length > 0 ? (
        <div className="space-y-6">
          {items.map((item, index) => (
            <div
              key={index}
              className="border border-slate-200 rounded-2xl p-5"
            >
              <div className="mb-5">
                <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">
                  Original
                </p>

                <p className="text-sm text-slate-700 leading-6 whitespace-pre-wrap">
                  {item?.original ||
                    "No original content was detected."}
                </p>
              </div>

              <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                <p className="text-xs uppercase tracking-wider text-green-700 font-semibold mb-2">
                  Tailored
                </p>

                <p className="text-sm text-green-900 leading-6 whitespace-pre-wrap">
                  {item?.tailored ||
                    "No tailored version was generated."}
                </p>
              </div>

              {item?.reason && (
                <div className="mt-4 bg-amber-50 rounded-xl p-4">
                  <p className="text-sm text-amber-900">
                    <span className="font-semibold">
                      Why this changed:{" "}
                    </span>

                    {item.reason}
                  </p>
                </div>
              )}
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

function KeywordCard({
  title,
  description,
  items = [],
  type,
}) {
  const isMatched = type === "matched";

  return (
    <div className="bg-white rounded-3xl shadow p-8">
      <div className="flex items-center gap-3 mb-5">
        {isMatched ? (
          <CheckCircle className="text-green-600" />
        ) : (
          <AlertTriangle className="text-amber-600" />
        )}

        <h2 className="text-2xl font-bold">
          {title}
        </h2>
      </div>

      <p className="text-sm text-slate-600 mb-5">
        {description}
      </p>

      <div className="flex flex-wrap gap-3">
        {items.length > 0 ? (
          items.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className={
                isMatched
                  ? "bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm"
                  : "bg-amber-100 text-amber-800 px-4 py-2 rounded-lg text-sm"
              }
            >
              {item}
            </span>
          ))
        ) : (
          <p className="text-sm text-slate-500">
            {isMatched
              ? "No matching keywords were found."
              : "No unsupported requirements were detected."}
          </p>
        )}
      </div>
    </div>
  );
}

function ListCard({ title, items = [] }) {
  return (
    <div className="bg-white rounded-3xl shadow p-8">
      <h2 className="text-2xl font-bold mb-5">
        {title}
      </h2>

      {items.length > 0 ? (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={`${index}-${item}`}
              className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm leading-6 text-blue-900"
            >
              {item}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">
          No suggestions are available for this resume.
        </p>
      )}
    </div>
  );
}

export default ResumeBuilder;
