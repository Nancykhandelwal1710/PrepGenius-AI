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
            Go back to Resume Builder and create your resume first.
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

  const personal = savedResume.personal || {};

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

        {/* HEADER */}
        <div className="no-print bg-slate-950 text-white rounded-3xl p-8 mb-8">
          <p className="text-sm uppercase tracking-widest text-blue-300 mb-3">
            Resume Preview
          </p>

          <h1 className="text-4xl md:text-5xl font-bold">
            Review Your Resume
          </h1>

          <p className="text-slate-300 mt-4 max-w-3xl leading-7">
            Review your resume before downloading it as a PDF.
          </p>
        </div>

        {/* ACTIONS */}
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

        {/* RESUME */}
        <article className="resume-sheet max-w-[850px] mx-auto bg-white border border-slate-200 shadow-xl px-10 py-12 text-slate-900">

          {/* PERSONAL HEADER */}
          <header className="border-b-2 border-slate-900 pb-6">

            <h1 className="text-4xl font-bold">
              {personal.name || "Your Name"}
            </h1>

            <div className="text-sm text-slate-600 mt-3 flex flex-wrap gap-x-4 gap-y-1">
              {personal.email && (
                <span>{personal.email}</span>
              )}

              {personal.phone && (
                <span>{personal.phone}</span>
              )}

              {personal.location && (
                <span>{personal.location}</span>
              )}
            </div>

            <div className="text-sm text-blue-700 mt-2 flex flex-wrap gap-x-4 gap-y-1">
              {personal.linkedin && (
                <span>{personal.linkedin}</span>
              )}

              {personal.github && (
                <span>{personal.github}</span>
              )}
            </div>

          </header>

          {/* SUMMARY */}
          {savedResume.summary && (
            <ResumeSection title="Professional Summary">
              <p className="text-sm leading-7">
                {savedResume.summary}
              </p>
            </ResumeSection>
          )}

          {/* SKILLS */}
          {savedResume.skills?.length > 0 && (
            <ResumeSection title="Skills">
              <div className="flex flex-wrap gap-2">
                {savedResume.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="text-sm"
                  >
                    {skill}
                    {index < savedResume.skills.length - 1 && " • "}
                  </span>
                ))}
              </div>
            </ResumeSection>
          )}

          {/* EXPERIENCE */}
          {savedResume.experience?.some(
            (item) =>
              item.jobTitle ||
              item.company ||
              item.description
          ) && (
            <ResumeSection title="Experience">
              <div className="space-y-6">

                {savedResume.experience.map((item, index) => {

                  if (
                    !item.jobTitle &&
                    !item.company &&
                    !item.description
                  ) {
                    return null;
                  }

                  return (
                    <div key={index}>

                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1">

                        <div>
                          <h3 className="font-bold">
                            {item.jobTitle}
                          </h3>

                          <p className="text-sm text-slate-600">
                            {item.company}
                            {item.location &&
                              ` • ${item.location}`}
                          </p>
                        </div>

                        <p className="text-sm text-slate-600">
                          {item.startDate}
                          {item.startDate &&
                            item.endDate &&
                            " – "}
                          {item.endDate}
                        </p>

                      </div>

                      {item.description && (
                        <p className="text-sm leading-7 mt-2 whitespace-pre-line">
                          {item.description}
                        </p>
                      )}

                    </div>
                  );
                })}

              </div>
            </ResumeSection>
          )}

          {/* EDUCATION */}
          {savedResume.education?.some(
            (item) =>
              item.degree ||
              item.institution
          ) && (
            <ResumeSection title="Education">
              <div className="space-y-5">

                {savedResume.education.map((item, index) => {

                  if (
                    !item.degree &&
                    !item.institution
                  ) {
                    return null;
                  }

                  return (
                    <div key={index}>

                      <div className="flex flex-col sm:flex-row sm:justify-between">

                        <div>
                          <h3 className="font-bold">
                            {item.degree}
                          </h3>

                          <p className="text-sm text-slate-600">
                            {item.institution}
                            {item.location &&
                              ` • ${item.location}`}
                          </p>
                        </div>

                        {item.year && (
                          <p className="text-sm text-slate-600">
                            {item.year}
                          </p>
                        )}

                      </div>

                    </div>
                  );
                })}

              </div>
            </ResumeSection>
          )}

          {/* PROJECTS */}
          {savedResume.projects?.some(
            (item) =>
              item.name ||
              item.description
          ) && (
            <ResumeSection title="Projects">
              <div className="space-y-6">

                {savedResume.projects.map((project, index) => {

                  if (
                    !project.name &&
                    !project.description
                  ) {
                    return null;
                  }

                  return (
                    <div key={index}>

                      <div className="flex flex-wrap items-center gap-2">

                        <h3 className="font-bold">
                          {project.name}
                        </h3>

                        {project.link && (
                          <span className="text-sm text-blue-700">
                            {project.link}
                          </span>
                        )}

                      </div>

                      {project.technologies && (
                        <p className="text-sm text-slate-600 mt-1">
                          <strong>Technologies:</strong>{" "}
                          {project.technologies}
                        </p>
                      )}

                      {project.description && (
                        <p className="text-sm leading-7 mt-2 whitespace-pre-line">
                          {project.description}
                        </p>
                      )}

                    </div>
                  );
                })}

              </div>
            </ResumeSection>
          )}

          {/* CERTIFICATIONS */}
          {savedResume.certifications?.some(
            (item) =>
              item.name ||
              item.issuer
          ) && (
            <ResumeSection title="Certifications">
              <div className="space-y-3">

                {savedResume.certifications.map(
                  (item, index) => {

                    if (
                      !item.name &&
                      !item.issuer
                    ) {
                      return null;
                    }

                    return (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:justify-between"
                      >

                        <div>
                          <h3 className="font-semibold">
                            {item.name}
                          </h3>

                          <p className="text-sm text-slate-600">
                            {item.issuer}
                          </p>
                        </div>

                        {item.year && (
                          <p className="text-sm text-slate-600">
                            {item.year}
                          </p>
                        )}

                      </div>
                    );
                  }
                )}

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
