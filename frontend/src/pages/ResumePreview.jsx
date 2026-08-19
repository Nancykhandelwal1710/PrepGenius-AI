import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, Check } from "lucide-react";

import ATSClassic from "../components/resume-templates/ATSClassic";
import ModernTech from "../components/resume-templates/ModernTech";
import EngineeringPro from "../components/resume-templates/EngineeringPro";

const templates = [
  {
    id: "ats-classic",
    name: "ATS Classic",
    description: "Clean, professional and optimized for traditional ATS screening.",
    badge: "ATS Friendly",
    component: ATSClassic,
  },
  {
    id: "modern-tech",
    name: "Modern Tech",
    description: "A modern technical layout with stronger visual hierarchy.",
    badge: "Modern",
    component: ModernTech,
  },
  {
    id: "engineering-pro",
    name: "Engineering Pro",
    description: "Compact and technical design for engineering-focused candidates.",
    badge: "Technical",
    component: EngineeringPro,
  },
];

function ResumePreview() {
  const [savedResume] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("tailoredResume") || "null"
      );
    } catch (error) {
      console.error("Could not read saved resume:", error);
      return null;
    }
  });

  const [selectedTemplate, setSelectedTemplate] = useState(
    "ats-classic"
  );

  const downloadPDF = () => {
    window.print();
  };

  if (!savedResume) {
    return (
      <div className="min-h-screen bg-[#FBFAF6] px-4 py-10">
        <div className="max-w-3xl mx-auto bg-white shadow p-8 text-center">
          <h1 className="text-3xl font-bold mb-3">
            No saved resume found
          </h1>

          <p className="text-[#14213D]/60 mb-6">
            Go back to Resume Builder and create your resume first.
          </p>

          <Link
            to="/resume-builder"
            className="inline-flex bg-[#2457D6] text-white px-6 py-3 rounded-xl font-semibold"
          >
            Back to Resume Builder
          </Link>
        </div>
      </div>
    );
  }

  const activeTemplate =
    templates.find((template) => template.id === selectedTemplate) ||
    templates[0];

  const TemplateComponent = activeTemplate.component;

  return (
    <div className="min-h-screen bg-[#FBFAF6] px-4 py-8 md:py-10">

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
              margin: 0;
            }
          }
        `}
      </style>

      <div className="max-w-7xl mx-auto">

        {/* PAGE HEADER */}
        <div className="no-print bg-[#14213D] text-white p-7 md:p-9 shadow-[7px_7px_0_#2457D6] mb-8">

          <p className="text-[#B8E34B] font-serif italic text-xl">
            Resume Studio
          </p>

          <h1 className="mt-1 text-3xl md:text-4xl font-black tracking-[-0.04em]">
            Choose your resume style.
          </h1>

          <p className="text-white/70 mt-3 max-w-3xl leading-7">
            Your information stays the same. Choose the design that best
            represents you, preview it, and download your final resume.
          </p>

        </div>

        {/* TEMPLATE SELECTOR */}
        <div className="no-print mb-10">

          <div className="flex items-center justify-between mb-5">

            <div>
              <h2 className="text-xl md:text-2xl font-bold text-[#14213D]">
                Resume Templates
              </h2>

              <p className="text-sm text-[#14213D]/60 mt-1">
                Select a template to preview your resume.
              </p>
            </div>

            <div className="hidden md:flex items-center gap-2 text-sm text-[#14213D]/60">
              <span className="w-2 h-2 rounded-full bg-[#B8E34B]" />
              3 styles available
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {templates.map((template) => {
              const isSelected =
                selectedTemplate === template.id;

              return (
                <button
                  key={template.id}
                  type="button"
                  onClick={() =>
                    setSelectedTemplate(template.id)
                  }
                  className={`text-left bg-white rounded-2xl p-5 border-2 transition-all duration-200 ${
                    isSelected
                      ? "border-[#2457D6] shadow-[5px_5px_0_#DCE6FF] -translate-y-1"
                      : "border-[#14213D]/10 hover:border-[#2457D6]/40 hover:-translate-y-0.5"
                  }`}
                >

                  <div className="flex items-start justify-between gap-3">

                    <div>
                      <span
                        className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full ${
                          isSelected
                            ? "bg-[#2457D6] text-white"
                            : "bg-[#DCE6FF] text-[#2457D6]"
                        }`}
                      >
                        {template.badge}
                      </span>

                      <h3 className="text-lg font-bold text-[#14213D] mt-3">
                        {template.name}
                      </h3>
                    </div>

                    {isSelected && (
                      <span className="w-8 h-8 rounded-full bg-[#2457D6] text-white flex items-center justify-center shrink-0">
                        <Check size={17} />
                      </span>
                    )}

                  </div>

                  <p className="text-sm text-[#14213D]/60 leading-6 mt-2">
                    {template.description}
                  </p>

                  <div
                    className={`mt-4 text-sm font-semibold ${
                      isSelected
                        ? "text-[#2457D6]"
                        : "text-[#14213D]"
                    }`}
                  >
                    {isSelected
                      ? "✓ Selected"
                      : "Preview this template →"}
                  </div>

                </button>
              );
            })}

          </div>

        </div>

        {/* ACTIONS */}
        <div className="no-print flex flex-col sm:flex-row gap-4 mb-7">

          <Link
            to="/resume-builder"
            className="bg-white border border-[#14213D]/20 text-[#14213D] px-6 py-3 rounded-xl font-semibold inline-flex items-center justify-center gap-2 hover:border-[#2457D6]"
          >
            <ArrowLeft size={18} />
            Back to Editor
          </Link>

          <button
            type="button"
            onClick={downloadPDF}
            className="bg-[#2457D6] text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center justify-center gap-2 hover:bg-[#14213D] transition"
          >
            <Download size={18} />
            Download as PDF
          </button>

        </div>

        {/* SELECTED TEMPLATE LABEL */}
        <div className="no-print flex items-center justify-between max-w-[850px] mx-auto mb-3">

          <div>
            <p className="text-xs uppercase tracking-wider font-bold text-[#14213D]/50">
              Selected template
            </p>

            <h2 className="text-lg font-bold text-[#14213D]">
              {activeTemplate.name}
            </h2>
          </div>

          <span className="text-xs font-semibold bg-[#EAF4C7] text-[#14213D] px-3 py-1.5 rounded-full">
            {activeTemplate.badge}
          </span>

        </div>

        {/* RESUME */}
        <article className="resume-sheet max-w-[850px] mx-auto bg-white border border-[#14213D]/10 shadow-[8px_8px_0_#DCE6FF] overflow-hidden">

          <TemplateComponent resume={savedResume} />

        </article>

      </div>
    </div>
  );
}

export default ResumePreview;
