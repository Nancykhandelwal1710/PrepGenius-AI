import { getSectorConfig } from "../../resume-config/sectorConfigs";
import { getSectionTitle } from "../../resume-config/resumeSections";
import { getResumeStrategy } from "../../resume-config/resumeStrategy";

function EngineeringPro({ resume }) {
  const sectorConfig = getSectorConfig(resume?.sector);
  const strategy = getResumeStrategy(resume);

  const personal = resume?.personal || {};

  // Check whether a section actually contains useful data
  const hasContent = (sectionType) => {
    switch (sectionType) {
      case "summary":
        return Boolean(resume?.summary?.trim());

      case "skills":
        return (
          Array.isArray(resume?.skills) &&
          resume.skills.some((skill) =>
            String(skill || "").trim()
          )
        );

      case "experience":
        return (
          Array.isArray(resume?.experience) &&
          resume.experience.some(
            (item) =>
              item?.jobTitle ||
              item?.company ||
              item?.description
          )
        );

      case "projects":
        return (
          Array.isArray(resume?.projects) &&
          resume.projects.some(
            (item) =>
              item?.name ||
              item?.description
          )
        );

      case "education":
        return (
          Array.isArray(resume?.education) &&
          resume.education.some(
            (item) =>
              item?.degree ||
              item?.institution
          )
        );

      case "certifications":
        return (
          Array.isArray(resume?.certifications) &&
          resume.certifications.some(
            (item) =>
              item?.name ||
              item?.issuer
          )
        );

      case "achievements":
        return (
          Array.isArray(resume?.achievements) &&
          resume.achievements.some((item) => {
            const text =
              typeof item === "string"
                ? item
                : item?.description ||
                  item?.title ||
                  "";

            return String(text).trim();
          })
        );

      default:
        return false;
    }
  };

  // Strategy decides both:
  // 1. Which sections should appear
  // 2. What order they should appear in
  const orderedSections = strategy.sections.filter(hasContent);

  const renderSection = (sectionType) => {
    switch (sectionType) {
      // =====================================================
      // SUMMARY
      // =====================================================
      case "summary":
        return (
          <Section
            title={getSectionTitle(
              "summary",
              sectorConfig
            )}
          >
            <p className="text-sm leading-6 text-slate-700 whitespace-pre-line">
              {resume.summary}
            </p>
          </Section>
        );

      // =====================================================
      // SKILLS
      // =====================================================
      case "skills":
        return (
          <Section
            title={getSectionTitle(
              "skills",
              sectorConfig
            )}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              {resume.skills
                .filter((skill) =>
                  String(skill || "").trim()
                )
                .map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 text-sm"
                  >
                    <span className="mt-2 w-1.5 h-1.5 bg-slate-900 rounded-full shrink-0" />

                    <span>{skill}</span>
                  </div>
                ))}
            </div>
          </Section>
        );

      // =====================================================
      // EXPERIENCE
      // =====================================================
      case "experience":
        return (
          <Section
            title={getSectionTitle(
              "experience",
              sectorConfig
            )}
          >
            <div className="space-y-6">
              {resume.experience.map((item, index) => {
                if (
                  !item?.jobTitle &&
                  !item?.company &&
                  !item?.description
                ) {
                  return null;
                }

                return (
                  <div key={index}>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                      <div>
                        <h3 className="font-bold text-base">
                          {item.jobTitle || "Position"}
                        </h3>

                        <p className="text-sm font-medium text-slate-600">
                          {item.company}

                          {item.location &&
                            ` • ${item.location}`}
                        </p>
                      </div>

                      {(item.startDate ||
                        item.endDate) && (
                        <p className="text-sm font-medium text-slate-500">
                          {item.startDate}

                          {item.startDate &&
                            item.endDate &&
                            " – "}

                          {item.endDate}
                        </p>
                      )}
                    </div>

                    {item.description && (
                      <div className="mt-2 text-sm leading-6 text-slate-700 whitespace-pre-line">
                        {item.description}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Section>
        );

      // =====================================================
      // PROJECTS
      // =====================================================
      case "projects":
        return (
          <Section
            title={getSectionTitle(
              "projects",
              sectorConfig
            )}
          >
            <div className="space-y-5">
              {resume.projects.map((project, index) => {
                if (
                  !project?.name &&
                  !project?.description
                ) {
                  return null;
                }

                return (
                  <div key={index}>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                      <h3 className="font-bold">
                        {project.name || "Project"}
                      </h3>

                      {project.link && (
                        <span className="text-sm text-blue-700">
                          {project.link}
                        </span>
                      )}
                    </div>

                    {project.technologies && (
                      <p className="text-xs font-semibold text-slate-500 mt-1">
                        {project.technologies}
                      </p>
                    )}

                    {project.description && (
                      <p className="text-sm leading-6 text-slate-700 mt-2 whitespace-pre-line">
                        {project.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </Section>
        );

      // =====================================================
      // EDUCATION
      // =====================================================
      case "education":
        return (
          <Section title="Education">
            <div className="space-y-4">
              {resume.education.map((item, index) => {
                if (
                  !item?.degree &&
                  !item?.institution
                ) {
                  return null;
                }

                return (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:justify-between gap-1"
                  >
                    <div>
                      <h3 className="font-bold">
                        {item.degree || "Degree"}
                      </h3>

                      <p className="text-sm text-slate-600">
                        {item.institution}

                        {item.location &&
                          ` • ${item.location}`}
                      </p>
                    </div>

                    {item.year && (
                      <p className="text-sm text-slate-500">
                        {item.year}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </Section>
        );

      // =====================================================
      // CERTIFICATIONS
      // =====================================================
      case "certifications":
        return (
          <Section title="Certifications">
            <div className="space-y-2">
              {resume.certifications.map(
                (item, index) => {
                  if (
                    !item?.name &&
                    !item?.issuer
                  ) {
                    return null;
                  }

                  return (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:justify-between gap-1 text-sm"
                    >
                      <div>
                        <span className="font-semibold">
                          {item.name}
                        </span>

                        {item.issuer && (
                          <span className="text-slate-600">
                            {" "}— {item.issuer}
                          </span>
                        )}
                      </div>

                      {item.year && (
                        <span className="text-slate-500">
                          {item.year}
                        </span>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          </Section>
        );

      // =====================================================
      // ACHIEVEMENTS
      // =====================================================
      case "achievements":
        return (
          <Section title="Achievements">
            <ul className="list-disc ml-5 space-y-1">
              {resume.achievements.map(
                (achievement, index) => {
                  const text =
                    typeof achievement === "string"
                      ? achievement
                      : achievement?.description ||
                        achievement?.title ||
                        "";

                  if (!String(text).trim()) {
                    return null;
                  }

                  return (
                    <li
                      key={index}
                      className="text-sm leading-5"
                    >
                      {text}
                    </li>
                  );
                }
              )}
            </ul>
          </Section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white text-slate-900 min-h-[1100px] font-sans px-8 sm:px-12 py-9">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <header className="border-b-4 border-slate-900 pb-5">

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">

          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {personal.name || "Your Name"}
            </h1>

            <p className="mt-1 text-sm font-semibold text-slate-600">
              {personal.title || "Software Engineer"}
            </p>
          </div>

          <div className="text-xs sm:text-sm text-slate-600 sm:text-right space-y-1">

            {personal.email && (
              <div>{personal.email}</div>
            )}

            {personal.phone && (
              <div>{personal.phone}</div>
            )}

            {personal.location && (
              <div>{personal.location}</div>
            )}

            <div className="flex sm:justify-end flex-wrap gap-x-3 gap-y-1 text-blue-700">

              {personal.linkedin && (
                <span>{personal.linkedin}</span>
              )}

              {personal.github && (
                <span>{personal.github}</span>
              )}

              {personal.portfolio && (
                <span>{personal.portfolio}</span>
              )}

            </div>

          </div>

        </div>

      </header>

      {/* =====================================================
          DYNAMIC RESUME SECTIONS
      ===================================================== */}
      <div>
        {orderedSections.map((sectionType) => (
          <div key={sectionType}>
            {renderSection(sectionType)}
          </div>
        ))}
      </div>

    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mt-6">

      <div className="flex items-center gap-3 mb-3">

        <h2 className="text-sm font-extrabold uppercase tracking-wider whitespace-nowrap">
          {title}
        </h2>

        <div className="h-px flex-1 bg-slate-300" />

      </div>

      {children}

    </section>
  );
}

export default EngineeringPro;
