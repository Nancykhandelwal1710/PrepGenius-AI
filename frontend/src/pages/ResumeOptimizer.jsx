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

const API_URL = import.meta.env.VITE_BACKEND_URL;

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

      const blob = new Blob([response.data], {
        type: expectedContentType,
      });

      const downloadUrl =
        window.URL.createObjectURL(blob);

      const dot = file.name.lastIndexOf(".");
      
      const base = 
        dot === -1
          ? file.name
          : file.name.substring(0, dot);

      const ext = 
        dot === -1
          ? isPDF
            ? ".pdf"
            : ".docx"
          : file.name.substring(dot);

      const link =
        document.createElement("a");

      link.href = downloadUrl;
      link.download =
        `${base}_optimized${ext}`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => {
        window.URL.revokeObjectURL(downloadUrl);
      }, 1000);

      setSuccess(
        "Your optimized resume has been downloaded successfully."
      );

    } catch (requestError) {
      console.error("Optimization error:", requestError);

      let message =
        "Resume optimization failed. Please try again.";

      if (requestError.response?.data instanceof Blob) {
        try{
          const errorText =
            await requestError.response.data.text();

          const parsedError = JSON.parse(errorText);

          message =
            parsedError.detail ||
            parsedError.error ||
            message; 
        }catch {
          message =
            "The server could not optimize this resume. Please try again.";
        }
      }else if (requestError.message) {
        message = requestError.message;
      }
      setError(message);
    } finally {
      setOptimizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFAF6] text-[#14213D] px-4 sm:px-6 py-8 md:py-10">
      <div className="max-w-7xl mx-auto">

        {/* Intro */}
        <section className="relative overflow-hidden bg-[#2457D6] text-white border-2 border-[#14213D] p-7 md:p-10 shadow-[8px_8px_0_#14213D]">
          <div className="absolute -right-10 -top-16 text-[12rem] leading-none font-black text-white/5">✦</div>
          <div className="absolute right-10 bottom-4 text-5xl text-[#B8E34B] rotate-12">↗</div>

          <div className="relative max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#B8E34B]">
              Resume improvement studio
            </p>
            <h1 className="mt-3 text-4xl md:text-6xl font-black tracking-[-0.055em] leading-[0.92]">
              Keep your resume.
              <br />
              <span className="font-serif italic font-normal text-[#B8E34B]">
                Make it work harder.
              </span>
            </h1>
            <p className="mt-6 text-white/75 text-base md:text-lg leading-8 max-w-3xl">
              Upload the resume you already like, tell us what role you're targeting,
              and PrepGenius will tailor the relevant content while keeping your original design.
            </p>
          </div>
        </section>

        {error && (
          <div className="mt-7 bg-[#FFF0EC] border-2 border-[#FF6B57]/40 text-[#9F3326] p-5 flex items-start gap-3">
            <AlertCircle size={22} className="shrink-0 mt-0.5" />
            <p className="leading-6">{error}</p>
          </div>
        )}

        {success && (
          <div className="mt-7 bg-[#F1F7D9] border-2 border-[#B8E34B]/70 text-[#526B00] p-5 flex items-start gap-3">
            <CheckCircle size={22} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-black">Ready to go.</p>
              <p className="mt-1">{success}</p>
            </div>
          </div>
        )}

        {/* Main workspace */}
        <section className="grid lg:grid-cols-[0.9fr_1.1fr] gap-6 mt-8">

          {/* Resume */}
          <div className="bg-white border-2 border-[#14213D]/10 p-6 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-serif italic text-[#2457D6]">01 / Start here</p>
                <h2 className="mt-1 text-3xl font-black tracking-[-0.04em]">
                  Your current resume
                </h2>
              </div>
              <div className="w-12 h-12 bg-[#EDF3FF] text-[#2457D6] flex items-center justify-center rounded-xl">
                <Upload size={22} />
              </div>
            </div>

            <p className="mt-4 text-[#14213D]/60 leading-7">
              Give us the original PDF or DOCX. We'll read the content first,
              then use the target role to decide what deserves more attention.
            </p>

            <label className="mt-7 block cursor-pointer">
              <div className="border-2 border-dashed border-[#2457D6]/35 bg-[#F7F9FF] p-7 text-center hover:border-[#2457D6] hover:bg-[#EDF3FF] transition-colors">
                <div className="mx-auto w-14 h-14 bg-white border border-[#2457D6]/15 text-[#2457D6] flex items-center justify-center rounded-xl shadow-sm">
                  <Upload size={24} />
                </div>
                <p className="mt-4 font-black">Choose your resume</p>
                <p className="mt-1 text-sm text-[#14213D]/50">
                  PDF or DOCX
                </p>
                <span className="mt-5 inline-block bg-[#14213D] text-white px-5 py-2.5 rounded-lg text-sm font-bold">
                  Browse files
                </span>
              </div>
              <input
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleUpload}
                className="hidden"
              />
            </label>

            {file && (
              <div className="mt-5 bg-[#EEF3FF] border border-[#2457D6]/15 p-4 flex items-start gap-3">
                <FileText size={20} className="text-[#2457D6] shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#14213D]/45">
                    Selected resume
                  </p>
                  <p className="mt-1 font-bold break-all">{file.name}</p>
                </div>
              </div>
            )}

            {extracting && (
              <div className="mt-5 flex items-center gap-3 text-[#2457D6] font-bold text-sm">
                <Sparkles size={18} className="animate-pulse" />
                Reading your resume...
              </div>
            )}

            {resumeText && !extracting && (
              <div className="mt-5 bg-[#F1F7D9] border border-[#B8E34B]/70 p-4 flex items-start gap-3">
                <CheckCircle size={20} className="text-[#648400] shrink-0 mt-0.5" />
                <div>
                  <p className="font-black text-[#526B00]">Resume is ready.</p>
                  <p className="text-sm text-[#526B00]/80 mt-1">
                    Your content has been extracted and is ready to optimize.
                  </p>
                </div>
              </div>
            )}

            {resumeText && (
              <details className="mt-5 group">
                <summary className="cursor-pointer text-sm font-bold text-[#2457D6]">
                  View extracted text
                </summary>
                <textarea
                  rows="10"
                  value={resumeText}
                  readOnly
                  className="mt-3 w-full border border-[#14213D]/10 p-4 text-sm bg-[#FBFAF6] text-[#14213D]/70 focus:outline-none"
                />
              </details>
            )}
          </div>

          {/* Target role */}
          <div className="bg-[#14213D] text-white border-2 border-[#14213D] p-6 md:p-8 shadow-[6px_6px_0_#2457D6]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-serif italic text-[#B8E34B]">02 / Aim it</p>
                <h2 className="mt-1 text-3xl font-black tracking-[-0.04em]">
                  What role are you applying for?
                </h2>
              </div>
              <div className="text-4xl">🎯</div>
            </div>

            <p className="mt-4 text-white/60 leading-7">
              Paste the complete job description. The more context you give us,
              the more useful the optimization can be.
            </p>

            <textarea
              rows="15"
              value={jobDescription}
              onChange={(event) => {
                setJobDescription(event.target.value);
                setError("");
                setSuccess("");
              }}
              placeholder="Paste the complete job description here..."
              className="mt-7 w-full bg-white text-[#14213D] border-2 border-white/10 p-5 text-sm leading-6 placeholder:text-[#14213D]/35 focus:outline-none focus:border-[#B8E34B] resize-y"
            />

            <button
              type="button"
              onClick={optimizePDF}
              disabled={optimizing || extracting || !file || !jobDescription.trim()}
              className="mt-5 w-full bg-[#B8E34B] text-[#14213D] py-4 px-5 font-black inline-flex justify-center items-center gap-2 hover:bg-white disabled:bg-white/20 disabled:text-white/40 disabled:cursor-not-allowed transition-colors"
            >
              {optimizing ? (
                <>
                  <Sparkles size={20} className="animate-pulse" />
                  Optimizing your resume...
                </>
              ) : (
                <>
                  <Download size={20} />
                  Optimize & download
                </>
              )}
            </button>

            <div className="mt-7 grid sm:grid-cols-2 gap-3">
              <div className="border border-white/10 p-4">
                <p className="text-[#B8E34B] font-black">01</p>
                <p className="mt-1 text-sm text-white/65">Relevant content gets more attention.</p>
              </div>
              <div className="border border-white/10 p-4">
                <p className="text-[#FF6B57] font-black">02</p>
                <p className="mt-1 text-sm text-white/65">Your original design stays intact.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Promise */}
        <section className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="bg-[#EDF3FF] border-2 border-[#14213D]/10 p-6">
            <p className="text-2xl">📄</p>
            <h3 className="mt-4 font-black text-xl">Your resume stays yours</h3>
            <p className="mt-2 text-sm leading-6 text-[#14213D]/60">
              Name, contact details, projects, education and other important information remain in place.
            </p>
          </div>

          <div className="bg-[#F1F7D9] border-2 border-[#14213D]/10 p-6">
            <p className="text-2xl">✦</p>
            <h3 className="mt-4 font-black text-xl">The content gets sharper</h3>
            <p className="mt-2 text-sm leading-6 text-[#14213D]/60">
              Relevant summary, projects and skills can be tailored toward the target job.
            </p>
          </div>

          <div className="bg-[#FFF0EC] border-2 border-[#14213D]/10 p-6">
            <p className="text-2xl">↗</p>
            <h3 className="mt-4 font-black text-xl">You get a usable file</h3>
            <p className="mt-2 text-sm leading-6 text-[#14213D]/60">
              The optimized PDF or DOCX is downloaded directly when the process finishes.
            </p>
          </div>
        </section>

        {/* Preservation checklist */}
        <section className="mt-8 mb-4 bg-white border-2 border-[#14213D] p-7 md:p-8 shadow-[6px_6px_0_#B8E34B]">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-8 items-start">
            <div>
              <p className="font-serif italic text-xl text-[#2457D6]">The promise</p>
              <h2 className="mt-1 text-3xl md:text-4xl font-black tracking-[-0.04em]">
                Improve the resume,
                <br />
                not its identity.
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
              {[
                "Your name and contact information",
                "Original PDF layout and design",
                "Project names and technologies",
                "Education and certifications",
                "Dates and coding-profile details",
                "Targeted job relevance",
              ].map((item) => (
                <div key={item} className="flex gap-3 items-start">
                  <CheckCircle size={18} className="text-[#2457D6] shrink-0 mt-0.5" />
                  <span className="text-[#14213D]/70 leading-6">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-7 pt-5 border-t border-[#14213D]/10 text-sm text-[#14213D]/50">
            Tip: the first request may take longer if the Render backend needs to wake up.
            Keep this page open until your download begins.
          </div>
        </section>
      </div>
    </div>
  );
}

export default ResumeBuilder;
