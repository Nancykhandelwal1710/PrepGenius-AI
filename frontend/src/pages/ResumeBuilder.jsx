import { useState } from "react";
import axios from "axios";
import {
  Upload,
  Sparkles,
  FileText,
  Download,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const API_URL = "https://prepgenius-backend-3841.onrender.com";

function ResumeBuilder() {
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState(
    localStorage.getItem("resumeText") || ""
  );

  const [jobDescription, setJobDescription] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleUpload = async (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    const isPDF =
      selectedFile.name.toLowerCase().endsWith(".pdf");
    
    const isDOCX =
      selectedFile.name.toLowerCase().endsWith(".docx");
        
    if (!isPDF && !isDOCX) {
      setError("Please upload a PDF or DOCX resume.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setResumeText("");
    setError("");
    setSuccess("");

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
        "The resume could not be read. Please upload a text-based PDF or DOCX file and try again."
      );
    } finally {
      setExtracting(false);
    }
  };

  const optimizePDF = async () => {
    if (!file) {
      setError("Please upload your original PDF or DOCX resume first.");
      return;
    }

    if (!jobDescription.trim()) {
      setError("Please paste the target job description first.");
      return;
    }

    try {
      setOptimizing(true);
      setError("");
      setSuccess("");

      const formData = new FormData();

      formData.append("file", file);
      formData.append("job_description", jobDescription);

      const fileName = file.name.toLowerCase();
      
      const isPDF = fileName.endsWith(".pdf");
      const isDOCX = fileName.endsWith(".docx");

      const endpoint = isPDF
        ? "/optimize-pdf"
        : "/optimize-docx";

      const expectedContentType = isPDF
        ? "application/pdf"
        : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        
      const response = await axios.post(
        `${API_URL}${endpoint}`,
        formData,
        {
          responseType: "blob",
          timeout: 180000,
        }
      );

      const contentType =
        response.headers["content-type"] || "";

      if (!contentType.includes(expectedContentType)) {
        throw new Error(
          "Unexpected file returned from server."
        );
      }

      const Blob = new Blob([response.data], {
        type: expectedContentType,
      });

      const downloadUrl =
        window.URL.createObjectURL(Blob);

      const dot = file.name.lastIndexOf(".");
      const base = file.name.substring(0, dot);
      const ext = file.name.substring(dot);
      
      const link =
        document.createElement("a");

      link.href = downloadUrl;
      link.download =
        `${base}_optimized${ext}`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(downloadUrl);

      setSuccess(
        "Your optimized resume has been downloaded successfully."
      );
    } catch (requestError) {
      console.error(requestError);
      setError("Resume optimization failed. Please try again.");
    } finally {
      setOptimizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="max-w-7xl mx-auto">
        <section className="bg-slate-950 text-white rounded-3xl p-8 md:p-10 shadow-xl mb-8">
          <p className="text-sm uppercase tracking-widest text-blue-300 mb-3">
            AI Resume Optimizer
          </p>

          <h1 className="text-4xl md:text-5xl font-bold max-w-4xl">
            Optimize your resume while preserving its original layout
          </h1>

          <p className="text-slate-300 mt-4 max-w-3xl leading-7">
            Upload your original PDF or Docx resume and paste the target job
            description. PrepGenius will improve relevant content and
            return an optimized PDF using your existing resume design.
          </p>
        </section>

        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-800 rounded-2xl p-5 flex items-start gap-3">
            <AlertCircle
              size={22}
              className="shrink-0 mt-0.5"
            />

            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-8 bg-green-50 border border-green-200 text-green-800 rounded-2xl p-5 flex items-start gap-3">
            <CheckCircle
              size={22}
              className="shrink-0 mt-0.5"
            />

            <p>{success}</p>
          </div>
        )}

        <section className="grid lg:grid-cols-2 gap-8">
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
                  Upload your current resume
                </h2>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-6 mb-5">
              Upload the original PDF that contains your complete
              resume design and information.
            </p>

            <input
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleUpload}
              className="w-full border border-dashed border-slate-300 rounded-xl p-4 text-sm"
            />

            {file && (
              <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="text-xs text-slate-500">
                  Selected resume
                </p>

                <p className="font-medium mt-1 break-all">
                  {file.name}
                </p>
              </div>
            )}

            {extracting && (
              <p className="mt-4 text-sm text-blue-600 font-medium">
                Reading your resume...
              </p>
            )}

            {resumeText && !extracting && (
              <div className="mt-5 bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                <CheckCircle
                  size={20}
                  className="text-green-600 shrink-0 mt-0.5"
                />

                <div>
                  <p className="font-semibold text-green-900">
                    Resume uploaded successfully
                  </p>

                  <p className="text-sm text-green-700 mt-1">
                    The text was extracted and the PDF is ready
                    for optimization.
                  </p>
                </div>
              </div>
            )}

            {resumeText && (
              <>
                <label className="block text-sm font-semibold mt-6 mb-2">
                  Extracted resume text
                </label>

                <textarea
                  rows="12"
                  value={resumeText}
                  readOnly
                  className="w-full border border-slate-300 rounded-xl p-4 text-sm bg-slate-50 text-slate-700"
                />
              </>
            )}
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

            <p className="text-sm text-slate-600 leading-6 mb-5">
              Paste the complete job description so the optimizer
              can tailor your summary, projects, and skills.
            </p>

            <textarea
              rows="18"
              value={jobDescription}
              onChange={(event) => {
                setJobDescription(event.target.value);
                setError("");
                setSuccess("");
              }}
              placeholder="Paste the complete job description here..."
              className="w-full border border-slate-300 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="button"
              onClick={optimizePDF}
              disabled={
                optimizing ||
                extracting ||
                !file ||
                !jobDescription.trim()
              }
              className="mt-5 w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed inline-flex justify-center items-center gap-2"
            >
              {optimizing ? (
                <>
                  <Sparkles
                    size={20}
                    className="animate-pulse"
                  />
                  Optimizing your resume...
                </>
              ) : (
                <>
                  <Download size={20} />
                  Optimize & Download Resume
                </>
              )}
            </button>

            <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-5">
              <h3 className="font-semibold text-blue-900">
                What will be preserved?
              </h3>

              <div className="mt-3 space-y-2 text-sm text-blue-800">
                <p>✓ Your name and contact information</p>
                <p>✓ Original PDF layout and design</p>
                <p>✓ Project names and technologies</p>
                <p>✓ Education and certifications</p>
                <p>✓ Dates and coding-profile details</p>
              </div>
            </div>

            <div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl p-5">
              <p className="text-sm text-amber-900 leading-6">
                The first request may take longer because the Render
                backend can require time to wake up. Keep the page open
                until the download begins.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ResumeBuilder;
