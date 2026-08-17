
import { useState } from "react";
import { useNavigate } from "react-router-dom";


function SectionHeader({ number, title, description }) {
  return (
    <div className="flex items-start gap-4 mb-6">
      <span className="text-[#2457D6] font-serif italic text-lg">{number}</span>
      <div>
        <h2 className="text-3xl font-black tracking-[-0.04em]">{title}</h2>
        <p className="mt-1 text-[#14213D]/50">{description}</p>
      </div>
    </div>
  );
}

const createEmptyResume = () => ({
  personal: {
    name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
  },

  summary: "",

  skills: [],

  experience: [
    {
      jobTitle: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  ],

  education: [
    {
      degree: "",
      institution: "",
      location: "",
      year: "",
    },
  ],

  projects: [
    {
      name: "",
      technologies: "",
      description: "",
      link: "",
    },
  ],

  certifications: [
    {
      name: "",
      issuer: "",
      year: "",
    },
  ],
});


function ResumeBuilder() {
  const navigate = useNavigate();

  // Load saved draft if one exists
  const getInitialResume = () => {
    try {
      const draft = localStorage.getItem("resumeBuilderDraft");

      if (draft) {
        const parsedDraft = JSON.parse(draft);

        return {
          ...createEmptyResume(),
          ...parsedDraft,
          personal: {
            ...createEmptyResume().personal,
            ...(parsedDraft.personal || {}),
          },
        };
      }
    } catch (error) {
      console.error(
        "Could not load resume draft:",
        error
      );
    }

    return createEmptyResume();
  };

  const [resume, setResume] = useState(
    getInitialResume
  );

  const [savedMessage, setSavedMessage] =
    useState("");

  // -----------------------------
  // PERSONAL INFORMATION
  // -----------------------------

  const updatePersonal = (field, value) => {
    setResume((previous) => ({
      ...previous,

      personal: {
        ...previous.personal,
        [field]: value,
      },
    }));
  };


  // -----------------------------
  // NORMAL FIELDS
  // -----------------------------

  const updateField = (field, value) => {
    setResume((previous) => ({
      ...previous,
      [field]: value,
    }));
  };


  // -----------------------------
  // ARRAY SECTIONS
  // -----------------------------

  const updateArrayItem = (
    section,
    index,
    field,
    value
  ) => {
    setResume((previous) => ({
      ...previous,

      [section]: previous[section].map(
        (item, itemIndex) =>
          itemIndex === index
            ? {
                ...item,
                [field]: value,
              }
            : item
      ),
    }));
  };


  const addItem = (
    section,
    item
  ) => {
    setResume((previous) => ({
      ...previous,

      [section]: [
        ...previous[section],
        item,
      ],
    }));
  };


  const removeItem = (
    section,
    index
  ) => {
    setResume((previous) => ({
      ...previous,

      [section]: previous[section].filter(
        (_, itemIndex) =>
          itemIndex !== index
      ),
    }));
  };


  // -----------------------------
  // SKILLS
  // -----------------------------

  const handleSkills = (value) => {
    const skills = value
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    updateField(
      "skills",
      skills
    );
  };


  // -----------------------------
  // SAVE DRAFT
  // -----------------------------

  const saveDraft = () => {
    try {
      localStorage.setItem(
        "resumeBuilderDraft",
        JSON.stringify(resume)
      );

      alert("✅ Resume draft saved successfully!");

    } catch (error) {
      console.error(
        "Could not save resume draft:",
        error
      );

      alert("❌ Unable to save resume draft.");
    }
  };

  // -----------------------------
  // PREVIEW
  // -----------------------------

  const saveAndPreview = () => {
    try {
      // Save the current Builder data
      // for Resume Preview.
      localStorage.setItem(
        "tailoredResume",
        JSON.stringify(resume)
      );

      // Also keep a draft copy.
      localStorage.setItem(
        "resumeBuilderDraft",
        JSON.stringify(resume)
      );

      navigate(
        "/resume-preview"
      );

    } catch (error) {
      console.error(
        "Could not prepare resume preview:",
        error
      );

      setSavedMessage(
        "Could not open resume preview."
      );
    }
  };


  return (
    <div className="min-h-screen bg-[#FBFAF6] text-[#14213D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-10">

        {/* HERO */}
        <section className="relative overflow-hidden bg-[#2457D6] text-white border-2 border-[#14213D] shadow-[8px_8px_0_#14213D] p-7 md:p-10">
          <div className="absolute -right-8 -top-16 text-[13rem] font-black leading-none text-white/5">✦</div>
          <div className="absolute right-10 bottom-5 text-5xl text-[#B8E34B] rotate-12">↗</div>

          <div className="relative max-w-4xl">
            <p className="text-sm uppercase tracking-[0.18em] font-bold text-[#B8E34B]">
              Resume Builder
            </p>
            <h1 className="mt-3 text-4xl md:text-6xl font-black tracking-[-0.055em] leading-[0.92]">
              Build a resume
              <br />
              <span className="font-serif italic font-normal text-[#B8E34B]">
                that sounds like you.
              </span>
            </h1>
            <p className="mt-6 max-w-3xl text-white/75 text-base md:text-lg leading-8">
              Add your story section by section. Save your draft whenever you want,
              then preview the finished resume when you're ready.
            </p>
          </div>
        </section>

        {savedMessage && (
          <div className="mt-7 bg-[#F1F7D9] border-2 border-[#B8E34B]/80 px-5 py-4 text-[#526B00] font-bold">
            {savedMessage}
          </div>
        )}

        {/* WORKSPACE */}
        <div className="grid lg:grid-cols-[230px_1fr] gap-7 mt-8 items-start">

          {/* PROGRESS RAIL */}
          <aside className="lg:sticky lg:top-24">
            <div className="bg-[#14213D] text-white p-5 shadow-[5px_5px_0_#B8E34B]">
              <p className="text-xs uppercase tracking-[0.16em] text-[#B8E34B] font-bold">
                Your build
              </p>
              <h2 className="mt-2 text-2xl font-black">One step at a time.</h2>

              <nav className="mt-6 space-y-1 text-sm">
                {[
                  ["01", "Personal"],
                  ["02", "Summary"],
                  ["03", "Skills"],
                  ["04", "Experience"],
                  ["05", "Education"],
                  ["06", "Projects"],
                  ["07", "Certifications"],
                ].map(([number, label]) => (
                  <a
                    key={number}
                    href={`#builder-${label.toLowerCase()}`}
                    className="flex items-center gap-3 px-3 py-2.5 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <span className="text-[#B8E34B] font-black text-xs">{number}</span>
                    <span>{label}</span>
                  </a>
                ))}
              </nav>

              <div className="mt-7 pt-5 border-t border-white/10">
                <p className="text-xs text-white/45 leading-5">
                  Your draft is stored locally in your browser when you save it.
                </p>
              </div>
            </div>
          </aside>

          {/* FORM */}
          <main className="min-w-0 space-y-6">

            {/* PERSONAL */}
            <section id="builder-personal" className="bg-white border-2 border-[#14213D]/10 p-6 md:p-8">
              <div className="flex items-start gap-4 mb-7">
                <span className="text-[#2457D6] font-serif italic text-lg">01</span>
                <div>
                  <h2 className="text-3xl font-black tracking-[-0.04em]">Personal information</h2>
                  <p className="mt-1 text-[#14213D]/50">Make it easy for a recruiter to reach you.</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {[
                  ["name", "Full Name", "text"],
                  ["email", "Email", "email"],
                  ["phone", "Phone", "text"],
                  ["location", "Location", "text"],
                  ["linkedin", "LinkedIn URL", "url"],
                  ["github", "GitHub URL", "url"],
                ].map(([field, placeholder, type]) => (
                  <input
                    key={field}
                    type={type}
                    placeholder={placeholder}
                    value={resume.personal[field]}
                    onChange={(event) => updatePersonal(field, event.target.value)}
                    className="w-full border-2 border-[#14213D]/10 bg-[#FBFAF6] px-4 py-3.5 outline-none focus:border-[#2457D6] transition-colors"
                  />
                ))}
              </div>
            </section>

            {/* SUMMARY */}
            <section id="builder-summary" className="bg-[#EDF3FF] border-2 border-[#2457D6]/10 p-6 md:p-8">
              <div className="flex items-start gap-4 mb-6">
                <span className="text-[#2457D6] font-serif italic text-lg">02</span>
                <div>
                  <h2 className="text-3xl font-black tracking-[-0.04em]">Professional summary</h2>
                  <p className="mt-1 text-[#14213D]/55">A short introduction that tells the reader what you bring.</p>
                </div>
              </div>

              <textarea
                rows={7}
                placeholder="Write 2–4 sentences about your experience, strengths, domain and the kind of role you're targeting..."
                value={resume.summary}
                onChange={(event) => updateField("summary", event.target.value)}
                className="w-full border-2 border-[#14213D]/10 bg-white px-4 py-4 outline-none focus:border-[#2457D6] resize-y"
              />
            </section>

            {/* SKILLS */}
            <section id="builder-skills" className="bg-white border-2 border-[#14213D]/10 p-6 md:p-8">
              <div className="flex items-start gap-4 mb-6">
                <span className="text-[#2457D6] font-serif italic text-lg">03</span>
                <div>
                  <h2 className="text-3xl font-black tracking-[-0.04em]">Skills</h2>
                  <p className="mt-1 text-[#14213D]/50">Add the technologies and strengths you want recruiters to notice.</p>
                </div>
              </div>

              <input
                type="text"
                placeholder="Python, React, SQL, FastAPI, Git"
                value={resume.skills.join(", ")}
                onChange={(event) => handleSkills(event.target.value)}
                className="w-full border-2 border-[#14213D]/10 bg-[#FBFAF6] px-4 py-3.5 outline-none focus:border-[#2457D6]"
              />

              {resume.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {resume.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-[#F1F7D9] border border-[#B8E34B] text-[#526B00] px-3 py-1.5 text-sm font-bold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </section>

            {/* EXPERIENCE */}
            <section id="builder-experience" className="bg-white border-2 border-[#14213D]/10 p-6 md:p-8">
              <SectionHeader number="04" title="Experience" description="Show what you did, how you did it, and what changed because of your work." />

              {resume.experience.map((item, index) => (
                <div key={index} className="mt-6 border-l-4 border-[#2457D6] bg-[#FBFAF6] p-5 md:p-6">
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <p className="font-black text-[#2457D6]">Experience {index + 1}</p>
                    {resume.experience.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem("experience", index)}
                        className="text-sm font-bold text-[#FF6B57] hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    {[
                      ["jobTitle", "Job Title"],
                      ["company", "Company"],
                      ["location", "Location"],
                      ["startDate", "Start Date (e.g. Jan 2023)"],
                      ["endDate", "End Date (e.g. Present)"],
                    ].map(([field, placeholder]) => (
                      <input
                        key={field}
                        type="text"
                        placeholder={placeholder}
                        value={item[field]}
                        onChange={(event) => updateArrayItem("experience", index, field, event.target.value)}
                        className="w-full border-2 border-[#14213D]/10 bg-white px-4 py-3.5 outline-none focus:border-[#2457D6]"
                      />
                    ))}
                  </div>

                  <textarea
                    rows={5}
                    placeholder="Describe your responsibilities, achievements and measurable impact..."
                    value={item.description}
                    onChange={(event) => updateArrayItem("experience", index, "description", event.target.value)}
                    className="w-full border-2 border-[#14213D]/10 bg-white px-4 py-4 mt-5 outline-none focus:border-[#2457D6] resize-y"
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  addItem("experience", {
                    jobTitle: "",
                    company: "",
                    location: "",
                    startDate: "",
                    endDate: "",
                    description: "",
                  })
                }
                className="mt-5 border-2 border-[#14213D] bg-[#14213D] text-white px-5 py-3 font-black hover:bg-[#2457D6] hover:border-[#2457D6] transition-colors"
              >
                + Add Experience
              </button>
            </section>

            {/* EDUCATION */}
            <section id="builder-education" className="bg-white border-2 border-[#14213D]/10 p-6 md:p-8">
              <SectionHeader number="05" title="Education" description="Keep the essentials clear and easy to scan." />

              {resume.education.map((item, index) => (
                <div key={index} className="mt-6 border-l-4 border-[#B8E34B] bg-[#FBFAF6] p-5 md:p-6">
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <p className="font-black text-[#526B00]">Education {index + 1}</p>
                    {resume.education.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem("education", index)}
                        className="text-sm font-bold text-[#FF6B57] hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    {[
                      ["degree", "Degree"],
                      ["institution", "Institution"],
                      ["location", "Location"],
                      ["year", "Graduation Year"],
                    ].map(([field, placeholder]) => (
                      <input
                        key={field}
                        type="text"
                        placeholder={placeholder}
                        value={item[field]}
                        onChange={(event) => updateArrayItem("education", index, field, event.target.value)}
                        className="w-full border-2 border-[#14213D]/10 bg-white px-4 py-3.5 outline-none focus:border-[#2457D6]"
                      />
                    ))}
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => addItem("education", { degree: "", institution: "", location: "", year: "" })}
                className="mt-5 border-2 border-[#14213D] bg-[#14213D] text-white px-5 py-3 font-black hover:bg-[#2457D6] hover:border-[#2457D6] transition-colors"
              >
                + Add Education
              </button>
            </section>

            {/* PROJECTS */}
            <section id="builder-projects" className="bg-white border-2 border-[#14213D]/10 p-6 md:p-8">
              <SectionHeader number="06" title="Projects" description="Especially useful for students and early-career candidates: show what you actually built." />

              {resume.projects.map((item, index) => (
                <div key={index} className="mt-6 border-l-4 border-[#2457D6] bg-[#EDF3FF] p-5 md:p-6">
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <p className="font-black text-[#2457D6]">Project {index + 1}</p>
                    {resume.projects.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem("projects", index)}
                        className="text-sm font-bold text-[#FF6B57] hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <input
                      type="text"
                      placeholder="Project Name"
                      value={item.name}
                      onChange={(event) => updateArrayItem("projects", index, "name", event.target.value)}
                      className="w-full border-2 border-[#14213D]/10 bg-white px-4 py-3.5 outline-none focus:border-[#2457D6]"
                    />
                    <input
                      type="text"
                      placeholder="Technologies"
                      value={item.technologies}
                      onChange={(event) => updateArrayItem("projects", index, "technologies", event.target.value)}
                      className="w-full border-2 border-[#14213D]/10 bg-white px-4 py-3.5 outline-none focus:border-[#2457D6]"
                    />
                    <input
                      type="url"
                      placeholder="Project Link"
                      value={item.link}
                      onChange={(event) => updateArrayItem("projects", index, "link", event.target.value)}
                      className="w-full md:col-span-2 border-2 border-[#14213D]/10 bg-white px-4 py-3.5 outline-none focus:border-[#2457D6]"
                    />
                  </div>

                  <textarea
                    rows={5}
                    placeholder="Describe the project, your contribution and results..."
                    value={item.description}
                    onChange={(event) => updateArrayItem("projects", index, "description", event.target.value)}
                    className="w-full border-2 border-[#14213D]/10 bg-white px-4 py-4 mt-5 outline-none focus:border-[#2457D6] resize-y"
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={() => addItem("projects", { name: "", technologies: "", description: "", link: "" })}
                className="mt-5 border-2 border-[#14213D] bg-[#14213D] text-white px-5 py-3 font-black hover:bg-[#2457D6] hover:border-[#2457D6] transition-colors"
              >
                + Add Project
              </button>
            </section>

            {/* CERTIFICATIONS */}
            <section id="builder-certifications" className="bg-white border-2 border-[#14213D]/10 p-6 md:p-8">
              <SectionHeader number="07" title="Certifications" description="Add credentials that strengthen your target role." />

              {resume.certifications.map((item, index) => (
                <div key={index} className="mt-6 border-l-4 border-[#FF6B57] bg-[#FFF0EC] p-5 md:p-6">
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <p className="font-black text-[#9F3326]">Certification {index + 1}</p>
                    {resume.certifications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem("certifications", index)}
                        className="text-sm font-bold text-[#FF6B57] hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-3 gap-5">
                    {[
                      ["name", "Certification Name"],
                      ["issuer", "Issuing Organization"],
                      ["year", "Year"],
                    ].map(([field, placeholder]) => (
                      <input
                        key={field}
                        type="text"
                        placeholder={placeholder}
                        value={item[field]}
                        onChange={(event) => updateArrayItem("certifications", index, field, event.target.value)}
                        className="w-full border-2 border-[#14213D]/10 bg-white px-4 py-3.5 outline-none focus:border-[#2457D6]"
                      />
                    ))}
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => addItem("certifications", { name: "", issuer: "", year: "" })}
                className="mt-5 border-2 border-[#14213D] bg-[#14213D] text-white px-5 py-3 font-black hover:bg-[#2457D6] hover:border-[#2457D6] transition-colors"
              >
                + Add Certification
              </button>
            </section>

            {/* FINISH */}
            <section className="bg-[#14213D] text-white p-7 md:p-9 shadow-[7px_7px_0_#2457D6]">
              <div className="max-w-3xl">
                <p className="text-[#B8E34B] font-serif italic text-xl">Almost there.</p>
                <h2 className="mt-1 text-3xl md:text-4xl font-black tracking-[-0.04em]">
                  Your resume is ready for a look.
                </h2>
                <p className="mt-3 text-white/60 leading-7">
                  Save your work, then open the preview to see the finished resume.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-7">
                <button
                  type="button"
                  onClick={saveDraft}
                  className="border-2 border-white/20 bg-white/10 hover:bg-white/15 text-white px-7 py-3.5 font-black transition-colors"
                >
                  Save Draft
                </button>

                <button
                  type="button"
                  onClick={saveAndPreview}
                  className="bg-[#B8E34B] hover:bg-white text-[#14213D] px-7 py-3.5 font-black transition-colors"
                >
                  Preview Resume →
                </button>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

export default ResumeBuilder;
