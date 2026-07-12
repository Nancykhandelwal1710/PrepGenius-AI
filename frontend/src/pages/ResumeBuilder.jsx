import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Upload,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  FileText,
  Pencil,
  Plus,
  Trash2,
  Save,
} from "lucide-react";

const API_URL = "https://prepgenius-backend-3841.onrender.com";

function ResumeBuilder() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  const [resumeText, setResumeText] = useState(
    localStorage.getItem("resumeText") || ""
  );

  const [jobDescription, setJobDescription] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [tailoring, setTailoring] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const [editedResume, setEditedResume] = useState({
    summary: "",
    skills: [],
    projects: [],
    experience: [],
  });

  const [saved, setSaved] = useState(false);

  const handleUpload = async (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setResult(null);
    setSaved(false);
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
      setSaved(false);
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

      const generatedResult = response.data;

      setResult(generatedResult);

      setEditedResume({
        summary: generatedResult.summary?.tailored || "",
        skills: generatedResult.skills?.tailored || [],
        projects: (generatedResult.projects || []).map(
          (item) => item.tailored || ""
        ),
        experience: (generatedResult.experience || []).map(
          (item) => item.tailored || ""
        ),
      });
    } catch (requestError) {
      console.error(requestError);

      setError(
        "The tailored resume could not be generated. Please try again."
      );
    } finally {
      setTailoring(false);
    }
  };

  const updateProject = (index, value) => {
    setEditedResume((previous) => {
      const updatedProjects = [...previous.projects];
      updatedProjects[index] = value;

      return {
        ...previous,
        projects: updatedProjects,
      };
    });

    setSaved(false);
  };

  const addProject = () => {
    setEditedResume((previous) => ({
      ...previous,
      projects: [...previous.projects, ""],
    }));

    setSaved(false);
  };

  const removeProject = (index) => {
    setEditedResume((previous) => ({
      ...previous,
      projects: previous.projects.filter(
        (_, projectIndex) => projectIndex !== index
      ),
    }));

    setSaved(false);
  };

  const updateExperience = (index, value) => {
    setEditedResume((previous) => {
      const updatedExperience = [...previous.experience];
      updatedExperience[index] = value;

      return {
        ...previous,
        experience: updatedExperience,
      };
    });

    setSaved(false);
  };

  const addExperience = () => {
    setEditedResume((previous) => ({
      ...previous,
      experience: [...previous.experience, ""],
    }));

    setSaved(false);
  };

  const removeExperience = (index) => {
    setEditedResume((previous) => ({
      ...previous,
      experience: previous.experience.filter(
        (_, experienceIndex) => experienceIndex !== index
      ),
    }));

    setSaved(false);
  };

  const saveFinalResume = () => {
    const finalResume = {
      targetRole: result?.target_role || "",
      summary: editedResume.summary,
      skills: editedResume.skills,
      projects: editedResume.projects.filter((item) => item.trim()),
      experience: editedResume.experience.filter((item) => item.trim()),
    };

    localStorage.setItem(
      "tailoredResume",
      JSON.stringify(finalResume)
    );

    setSaved(true);
  };
  

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="max-w-7xl mx-auto">
        <section className="bg-slate-950 text-white rounded-3xl p-8 md:p-10 shadow-xl mb-8">
          <p className="text-sm uppercase tracking-widest text-blue-300 mb-3">
            AI Resume Tailor
          </p>

          <h1 className="text-4xl md:text-5xl font-bold max-w-4xl">
            Build a job-focused version of your resume
          </h1>

          <p className="text-slate-300 mt-4 max-w-3xl leading-7">
            Upload your resume, add a job description, review the AI changes,
            and edit every section before creating the final version.
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
              <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="text-xs text-slate-500">
                  Selected resume
                </p>

                <p className="font-medium mt-1">{file.name}</p>
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

            <textarea
              rows="18"
              value={jobDescription}
              onChange={(event) =>
                setJobDescription(event.target.value)
              }
              placeholder="Paste the complete job description here..."
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

            <div className="bg-white rounded-3xl shadow p-8">
              <div className="flex items-center gap-3 mb-6">
                <Pencil className="text-blue-600" />

                <div>
                  <p className="text-sm text-blue-600 font-semibold">
                    Final Resume Editor
                  </p>

                  <h2 className="text-3xl font-bold">
                    Review and edit every section
                  </h2>
                </div>
              </div>

              <div className="space-y-10">
                <ComparisonEditor
                  title="Professional Summary"
                  original={
                    result.summary?.original ||
                    "No original summary detected."
                  }
                  reason={result.summary?.reason}
                >
                  <textarea
                    rows="8"
                    value={editedResume.summary}
                    onChange={(event) => {
                      setEditedResume((previous) => ({
                        ...previous,
                        summary: event.target.value,
                      }));

                      setSaved(false);
                    }}
                    className="w-full border border-slate-300 rounded-xl p-4 text-sm leading-7 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </ComparisonEditor>

                <ComparisonEditor
                  title="Skills"
                  original={
                    (result.skills?.original || []).join(", ") ||
                    "No original skills detected."
                  }
                  reason={result.skills?.reason}
                >
                  <textarea
                    rows="5"
                    value={editedResume.skills.join(", ")}
                    onChange={(event) => {
                      const skills = event.target.value
                        .split(",")
                        .map((skill) => skill.trim())
                        .filter(Boolean);

                      setEditedResume((previous) => ({
                        ...previous,
                        skills,
                      }));

                      setSaved(false);
                    }}
                    placeholder="Python, FastAPI, React, SQL"
                    className="w-full border border-slate-300 rounded-xl p-4 text-sm leading-7 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <p className="text-xs text-slate-500 mt-2">
                    Separate each skill using a comma.
                  </p>
                </ComparisonEditor>

                <EditableListSection
                  title="Projects"
                  originalItems={(result.projects || []).map(
                    (item) => item.original || ""
                  )}
                  editedItems={editedResume.projects}
                  onUpdate={updateProject}
                  onAdd={addProject}
                  onRemove={removeProject}
                />

                <EditableListSection
                  title="Experience"
                  originalItems={(result.experience || []).map(
                    (item) => item.original || ""
                  )}
                  editedItems={editedResume.experience}
                  onUpdate={updateExperience}
                  onAdd={addExperience}
                  onRemove={removeExperience}
                />
              </div>

              <button
                type="button"
                onClick={saveFinalResume}
                className="mt-10 w-full bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 inline-flex items-center justify-center gap-2"
              >
                <Save size={20} />
                Save Final Resume
              </button>

              {saved && (
                <button
                  type="button"
                  onClick={() => navigate("/resume-preview")}
                  className="mt-4 w-full bg-slate-900 text-white py-4 rounded-xl font-semibold hover:bg-slate-800"
                >
                  Preview & Download Resume
                </button>
              )}
              
              {saved && (
                <div className="mt-5 bg-green-50 border border-green-200 rounded-xl p-5 flex gap-3">
                  <CheckCircle className="text-green-600 shrink-0" />

                  <div>
                    <p className="font-semibold text-green-900">
                      Final resume saved
                    </p>

                    <p className="text-sm text-green-700 mt-1">
                      Your edited content is ready for resume preview and
                      download.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <KeywordCard
                title="Matched keywords"
                description="These keywords are supported by your resume."
                items={result.keywords || []}
                matched
              />

              <KeywordCard
                title="Unsupported requirements"
                description="Only add these if you genuinely have the skill or experience."
                items={result.missing_keywords || []}
              />
            </div>

            <div className="bg-white rounded-3xl shadow p-8">
              <h2 className="text-2xl font-bold mb-5">
                What to improve before applying
              </h2>

              {(result.suggestions || []).length > 0 ? (
                <div className="space-y-3">
                  {result.suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-900 leading-6"
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  No additional suggestions are available.
                </p>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function ComparisonEditor({
  title,
  original,
  reason,
  children,
}) {
  return (
    <div className="border-b border-slate-200 pb-10">
      <h3 className="text-2xl font-bold mb-5">{title}</h3>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">
            Original
          </p>

          <p className="text-sm text-slate-700 leading-7 whitespace-pre-wrap">
            {original}
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
          <p className="text-xs uppercase tracking-wider text-green-700 font-semibold mb-3">
            Editable tailored version
          </p>

          {children}
        </div>
      </div>

      {reason && (
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm text-amber-900">
            <span className="font-semibold">
              Why this changed:{" "}
            </span>
            {reason}
          </p>
        </div>
      )}
    </div>
  );
}

function EditableListSection({
  title,
  originalItems,
  editedItems,
  onUpdate,
  onAdd,
  onRemove,
}) {
  return (
    <div className="border-b border-slate-200 pb-10">
      <div className="flex items-center justify-between gap-4 mb-5">
        <h3 className="text-2xl font-bold">{title}</h3>

        <button
          type="button"
          onClick={onAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold inline-flex items-center gap-2"
        >
          <Plus size={17} />
          Add item
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-4">
            Original
          </p>

          {originalItems.length > 0 ? (
            <div className="space-y-4">
              {originalItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-white border border-slate-200 rounded-xl p-4 text-sm text-slate-700 leading-6"
                >
                  {item || "No original content detected."}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              No original content was detected.
            </p>
          )}
        </div>

        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
          <p className="text-xs uppercase tracking-wider text-green-700 font-semibold mb-4">
            Editable tailored version
          </p>

          {editedItems.length > 0 ? (
            <div className="space-y-4">
              {editedItems.map((item, index) => (
                <div key={index} className="flex gap-3">
                  <textarea
                    rows="4"
                    value={item}
                    onChange={(event) =>
                      onUpdate(index, event.target.value)
                    }
                    className="flex-1 border border-slate-300 bg-white rounded-xl p-4 text-sm leading-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="self-start bg-red-50 text-red-600 border border-red-200 p-3 rounded-xl hover:bg-red-100"
                    aria-label={`Remove ${title} item`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 mb-4">
              No tailored content is available. Add an item manually.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function KeywordCard({
  title,
  description,
  items,
  matched = false,
}) {
  return (
    <div className="bg-white rounded-3xl shadow p-8">
      <div className="flex items-center gap-3 mb-4">
        {matched ? (
          <CheckCircle className="text-green-600" />
        ) : (
          <AlertTriangle className="text-amber-600" />
        )}

        <h2 className="text-2xl font-bold">{title}</h2>
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
                matched
                  ? "bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm"
                  : "bg-amber-100 text-amber-800 px-4 py-2 rounded-lg text-sm"
              }
            >
              {item}
            </span>
          ))
        ) : (
          <p className="text-sm text-slate-500">
            No items were found.
          </p>
        )}
      </div>
    </div>
  );
}

export default ResumeBuilder;
