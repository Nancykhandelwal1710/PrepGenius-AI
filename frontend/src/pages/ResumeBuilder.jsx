
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div className="min-h-screen bg-slate-100 py-10 px-4">

      <div className="max-w-6xl mx-auto">

        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}

        <div className="bg-slate-950 text-white rounded-3xl p-8 mb-8">

          <p className="text-blue-300 text-sm uppercase tracking-widest mb-3">
            Resume Builder
          </p>

          <h1 className="text-4xl md:text-5xl font-bold">
            Build Your Professional Resume
          </h1>

          <p className="text-slate-300 mt-4 max-w-2xl">
            Create a professional,
            ATS-friendly resume from
            scratch using your own
            information.
          </p>

        </div>


        {/* ========================================= */}
        {/* SAVE MESSAGE */}
        {/* ========================================= */}

        {savedMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-xl font-medium">
            {savedMessage}
          </div>
        )}


        {/* ========================================= */}
        {/* PERSONAL INFORMATION */}
        {/* ========================================= */}

        <section className="bg-white rounded-3xl shadow-sm p-8 mb-6">

          <h2 className="text-2xl font-bold mb-6">
            Personal Information
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            <input
              type="text"
              placeholder="Full Name"
              value={
                resume.personal.name
              }
              onChange={(event) =>
                updatePersonal(
                  "name",
                  event.target.value
                )
              }
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="email"
              placeholder="Email"
              value={
                resume.personal.email
              }
              onChange={(event) =>
                updatePersonal(
                  "email",
                  event.target.value
                )
              }
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              placeholder="Phone"
              value={
                resume.personal.phone
              }
              onChange={(event) =>
                updatePersonal(
                  "phone",
                  event.target.value
                )
              }
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              placeholder="Location"
              value={
                resume.personal.location
              }
              onChange={(event) =>
                updatePersonal(
                  "location",
                  event.target.value
                )
              }
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="url"
              placeholder="LinkedIn URL"
              value={
                resume.personal.linkedin
              }
              onChange={(event) =>
                updatePersonal(
                  "linkedin",
                  event.target.value
                )
              }
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="url"
              placeholder="GitHub URL"
              value={
                resume.personal.github
              }
              onChange={(event) =>
                updatePersonal(
                  "github",
                  event.target.value
                )
              }
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

        </section>


        {/* ========================================= */}
        {/* SUMMARY */}
        {/* ========================================= */}

        <section className="bg-white rounded-3xl shadow-sm p-8 mb-6">

          <h2 className="text-2xl font-bold mb-2">
            Professional Summary
          </h2>

          <p className="text-sm text-slate-500 mb-5">
            Write 2–4 sentences describing
            your professional profile.
          </p>

          <textarea
            rows={6}
            placeholder="Write your professional summary..."
            value={
              resume.summary
            }
            onChange={(event) =>
              updateField(
                "summary",
                event.target.value
              )
            }
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />

        </section>


        {/* ========================================= */}
        {/* SKILLS */}
        {/* ========================================= */}

        <section className="bg-white rounded-3xl shadow-sm p-8 mb-6">

          <h2 className="text-2xl font-bold mb-2">
            Skills
          </h2>

          <p className="text-sm text-slate-500 mb-5">
            Separate each skill with a comma.
          </p>

          <input
            type="text"
            placeholder="Python, React, SQL, FastAPI, Git"
            value={
              resume.skills.join(", ")
            }
            onChange={(event) =>
              handleSkills(
                event.target.value
              )
            }
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          {resume.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">

              {resume.skills.map(
                (skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                )
              )}

            </div>
          )}

        </section>


        {/* ========================================= */}
        {/* EXPERIENCE */}
        {/* ========================================= */}

        <section className="bg-white rounded-3xl shadow-sm p-8 mb-6">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

            <h2 className="text-2xl font-bold">
              Experience
            </h2>

            <button
              type="button"
              onClick={() =>
                addItem(
                  "experience",
                  {
                    jobTitle: "",
                    company: "",
                    location: "",
                    startDate: "",
                    endDate: "",
                    description: "",
                  }
                )
              }
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold"
            >
              + Add Experience
            </button>

          </div>


          {resume.experience.map(
            (item, index) => (
              <div
                key={index}
                className="border border-slate-200 rounded-2xl p-6 mb-5"
              >

                <div className="grid md:grid-cols-2 gap-5">

                  <input
                    type="text"
                    placeholder="Job Title"
                    value={
                      item.jobTitle
                    }
                    onChange={(event) =>
                      updateArrayItem(
                        "experience",
                        index,
                        "jobTitle",
                        event.target.value
                      )
                    }
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <input
                    type="text"
                    placeholder="Company"
                    value={
                      item.company
                    }
                    onChange={(event) =>
                      updateArrayItem(
                        "experience",
                        index,
                        "company",
                        event.target.value
                      )
                    }
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <input
                    type="text"
                    placeholder="Location"
                    value={
                      item.location
                    }
                    onChange={(event) =>
                      updateArrayItem(
                        "experience",
                        index,
                        "location",
                        event.target.value
                      )
                    }
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <input
                    type="text"
                    placeholder="Start Date (e.g. Jan 2023)"
                    value={
                      item.startDate
                    }
                    onChange={(event) =>
                      updateArrayItem(
                        "experience",
                        index,
                        "startDate",
                        event.target.value
                      )
                    }
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <input
                    type="text"
                    placeholder="End Date (e.g. Present)"
                    value={
                      item.endDate
                    }
                    onChange={(event) =>
                      updateArrayItem(
                        "experience",
                        index,
                        "endDate",
                        event.target.value
                      )
                    }
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>


                <textarea
                  rows={5}
                  placeholder="Describe your responsibilities, achievements and impact..."
                  value={
                    item.description
                  }
                  onChange={(event) =>
                    updateArrayItem(
                      "experience",
                      index,
                      "description",
                      event.target.value
                    )
                  }
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 mt-5 outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                />


                {resume.experience.length >
                  1 && (
                  <button
                    type="button"
                    onClick={() =>
                      removeItem(
                        "experience",
                        index
                      )
                    }
                    className="text-red-600 hover:text-red-700 font-medium mt-4"
                  >
                    Remove Experience
                  </button>
                )}

              </div>
            )
          )}

        </section>


        {/* ========================================= */}
        {/* EDUCATION */}
        {/* ========================================= */}

        <section className="bg-white rounded-3xl shadow-sm p-8 mb-6">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

            <h2 className="text-2xl font-bold">
              Education
            </h2>

            <button
              type="button"
              onClick={() =>
                addItem(
                  "education",
                  {
                    degree: "",
                    institution: "",
                    location: "",
                    year: "",
                  }
                )
              }
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold"
            >
              + Add Education
            </button>

          </div>


          {resume.education.map(
            (item, index) => (
              <div
                key={index}
                className="border border-slate-200 rounded-2xl p-6 mb-5"
              >

                <div className="grid md:grid-cols-2 gap-5">

                  <input
                    type="text"
                    placeholder="Degree"
                    value={
                      item.degree
                    }
                    onChange={(event) =>
                      updateArrayItem(
                        "education",
                        index,
                        "degree",
                        event.target.value
                      )
                    }
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <input
                    type="text"
                    placeholder="Institution"
                    value={
                      item.institution
                    }
                    onChange={(event) =>
                      updateArrayItem(
                        "education",
                        index,
                        "institution",
                        event.target.value
                      )
                    }
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <input
                    type="text"
                    placeholder="Location"
                    value={
                      item.location
                    }
                    onChange={(event) =>
                      updateArrayItem(
                        "education",
                        index,
                        "location",
                        event.target.value
                      )
                    }
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <input
                    type="text"
                    placeholder="Graduation Year"
                    value={
                      item.year
                    }
                    onChange={(event) =>
                      updateArrayItem(
                        "education",
                        index,
                        "year",
                        event.target.value
                      )
                    }
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>


                {resume.education.length >
                  1 && (
                  <button
                    type="button"
                    onClick={() =>
                      removeItem(
                        "education",
                        index
                      )
                    }
                    className="text-red-600 hover:text-red-700 font-medium mt-4"
                  >
                    Remove Education
                  </button>
                )}

              </div>
            )
          )}

        </section>


        {/* ========================================= */}
        {/* PROJECTS */}
        {/* ========================================= */}

        <section className="bg-white rounded-3xl shadow-sm p-8 mb-6">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

            <h2 className="text-2xl font-bold">
              Projects
            </h2>

            <button
              type="button"
              onClick={() =>
                addItem(
                  "projects",
                  {
                    name: "",
                    technologies: "",
                    description: "",
                    link: "",
                  }
                )
              }
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold"
            >
              + Add Project
            </button>

          </div>


          {resume.projects.map(
            (item, index) => (
              <div
                key={index}
                className="border border-slate-200 rounded-2xl p-6 mb-5"
              >

                <div className="grid md:grid-cols-2 gap-5">

                  <input
                    type="text"
                    placeholder="Project Name"
                    value={
                      item.name
                    }
                    onChange={(event) =>
                      updateArrayItem(
                        "projects",
                        index,
                        "name",
                        event.target.value
                      )
                    }
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <input
                    type="text"
                    placeholder="Technologies"
                    value={
                      item.technologies
                    }
                    onChange={(event) =>
                      updateArrayItem(
                        "projects",
                        index,
                        "technologies",
                        event.target.value
                      )
                    }
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <input
                    type="url"
                    placeholder="Project Link"
                    value={
                      item.link
                    }
                    onChange={(event) =>
                      updateArrayItem(
                        "projects",
                        index,
                        "link",
                        event.target.value
                      )
                    }
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>


                <textarea
                  rows={5}
                  placeholder="Describe the project, your contribution and results..."
                  value={
                    item.description
                  }
                  onChange={(event) =>
                    updateArrayItem(
                      "projects",
                      index,
                      "description",
                      event.target.value
                    )
                  }
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 mt-5 outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                />


                {resume.projects.length >
                  1 && (
                  <button
                    type="button"
                    onClick={() =>
                      removeItem(
                        "projects",
                        index
                      )
                    }
                    className="text-red-600 hover:text-red-700 font-medium mt-4"
                  >
                    Remove Project
                  </button>
                )}

              </div>
            )
          )}

        </section>


        {/* ========================================= */}
        {/* CERTIFICATIONS */}
        {/* ========================================= */}

        <section className="bg-white rounded-3xl shadow-sm p-8 mb-8">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

            <h2 className="text-2xl font-bold">
              Certifications
            </h2>

            <button
              type="button"
              onClick={() =>
                addItem(
                  "certifications",
                  {
                    name: "",
                    issuer: "",
                    year: "",
                  }
                )
              }
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold"
            >
              + Add Certification
            </button>

          </div>


          {resume.certifications.map(
            (item, index) => (
              <div
                key={index}
                className="border border-slate-200 rounded-2xl p-6 mb-5"
              >

                <div className="grid md:grid-cols-3 gap-5">

                  <input
                    type="text"
                    placeholder="Certification Name"
                    value={
                      item.name
                    }
                    onChange={(event) =>
                      updateArrayItem(
                        "certifications",
                        index,
                        "name",
                        event.target.value
                      )
                    }
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <input
                    type="text"
                    placeholder="Issuing Organization"
                    value={
                      item.issuer
                    }
                    onChange={(event) =>
                      updateArrayItem(
                        "certifications",
                        index,
                        "issuer",
                        event.target.value
                      )
                    }
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <input
                    type="text"
                    placeholder="Year"
                    value={
                      item.year
                    }
                    onChange={(event) =>
                      updateArrayItem(
                        "certifications",
                        index,
                        "year",
                        event.target.value
                      )
                    }
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>


                {resume.certifications.length >
                  1 && (
                  <button
                    type="button"
                    onClick={() =>
                      removeItem(
                        "certifications",
                        index
                      )
                    }
                    className="text-red-600 hover:text-red-700 font-medium mt-4"
                  >
                    Remove Certification
                  </button>
                )}

              </div>
            )
          )}

        </section>


        {/* ========================================= */}
        {/* ACTION BUTTONS */}
        {/* ========================================= */}

        <div className="flex flex-col sm:flex-row justify-end gap-4 pb-10">

          <button
            type="button"
            onClick={saveDraft}
            className="border border-slate-300 bg-white hover:bg-slate-50 px-7 py-3 rounded-xl font-semibold"
          >
            Save Draft
          </button>


          <button
            type="button"
            onClick={saveAndPreview}
            className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-xl font-semibold"
          >
            Preview Resume
          </button>

        </div>

      </div>
    </div>
  );
}

export default ResumeBuilder;

