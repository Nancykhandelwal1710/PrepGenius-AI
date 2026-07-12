import { Link } from "react-router-dom";
import { ArrowLeft, Download } from "lucide-react";

function ResumePreview() {
  let savedResume = null;

  try {
    savedResume = JSON.parse(
      localStorage.getItem("tailoredResume") || "null"
    );
  } catch (error) {
    console.error("Could not read saved resume:", error);
  }

  const downloadPDF = () => {
    window.print();
  };

  if (!savedResume) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-10">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow p-8 text-center">
          <h1 className="text-3xl font-bold mb-3">
            No saved resume found
          </h1>

          <p className="text-slate-600 mb-6">
            Go back to Resume Builder, tailor your resume, and click
            “Save Final Resume” first.
          </p>

          <Link
            to="/resume-builder"
            className="inline-flex bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Back to Resume Builder
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <style>
        {`
          @media print {
            nav,
            .no-print {
              display: none !important;
            }

            body {
              background: white !important;
            }

            .resume-sheet {
              box-shadow: none !important;
              border: none !important;
              margin: 0 !important;
              width: 100% !important;
              max-width: none !important;
            }

            @page {
              size: A4;
              margin: 14mm;
            }
          }
        `}
      </style>

      <div className="max-w-6xl mx-auto">
        <div className="no-print bg-slate-950 text-white rounded-3xl p-8 mb-8">
          <p className="text-sm uppercase tracking-widest text-blue-300 mb-3">
            Resume Preview
          </p>

          <h1 className="text-4xl md:text-5xl font-bold">
            Review your final tailored resume
          </h1>

          <p className="text-slate-300 mt-4 max-w-3xl leading-7">
            Check the content below. When it looks correct, use the download
            button and choose “Save as PDF” in the print window.
          </p>
        </div>

        <div className="no-print flex flex-col sm:flex-row gap-4 mb-8">
          <Link
            to="/resume-builder"
            className="bg-white border border-slate-300 text-slate-700 px-6 py-3 rounded-xl font-semibold inline-flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
            Back to Editor
          </Link>

          <button
            type="button"
            onClick={downloadPDF}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center justify-center gap-2 hover:bg-blue-700"
          >
            <Download size={18} />
            Download as PDF
          </button>
        </div>

        <article className="resume-sheet max-w-[850px] mx-auto bg-white border border-slate-200 shadow-xl px-10 py-12 text-slate-900">
          <header className="border-b-2 border-slate-900 pb-6">
            <h1 className="text-4xl font-bold">
              Your Name
            </h1>

            <p className="text-lg text-slate-600 mt-2">
              {savedResume.targetRole || "Target Role"}
            </p>
          </header>

          {savedResume.summary && (
            <ResumeSection title="Professional Summary">
              <p className="text-sm leading-7">
                {savedResume.summary}
              </p>
            </ResumeSection>
          )}

          {savedResume.skills?.length > 0 && (
            <ResumeSection title="Technical Skills">
              <p className="text-sm leading-7">
                {savedResume.skills.join(" • ")}
              </p>
            </ResumeSection>
          )}

          {savedResume.projects?.length > 0 && (
            <ResumeSection title="Projects">
              <div className="space-y-4">
                {savedResume.projects.map((project, index) => (
                  <div key={index}>
                    <h3 className="font-semibold">
                      Project {index + 1}
                    </h3>

                    <p className="text-sm leading-7 mt-1">
                      {project}
                    </p>
                  </div>
                ))}
              </div>
            </ResumeSection>
          )}

          {savedResume.experience?.length > 0 && (
            <ResumeSection title="Experience">
              <div className="space-y-4">
                {savedResume.experience.map((item, index) => (
                  <p key={index} className="text-sm leading-7">
                    {item}
                  </p>
                ))}
              </div>
            </ResumeSection>
          )}
        </article>
      </div>
    </div>
  );
}

function ResumeSection({ title, children }) {
  return (
    <section className="mt-7">
      <h2 className="text-lg font-bold uppercase tracking-wide border-b border-slate-300 pb-2 mb-3">
        {title}
      </h2>

      {children}
    </section>
  );
}

export default ResumePreview;
