import { getSectorConfig } from "../../resume-config/sectorConfigs";
import { getSectionTitle } from "../../resume-config/resumeSections";
import { getResumeStrategy } from "../../resume-config/resumeStrategy";

function ATSClassic({ resume }) {
  const sectorConfig = getSectorConfig(resume?.sector);
  const strategy = getResumeStrategy(resume);

  const personal = resume?.personal || {};

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
          resume.achievements.some((item) =>
            String(
              typeof item === "string"
                ? item
                : item?.description || item?.title || ""
            ).trim()
          )
        );

      default:
        return false;
    }
  };

  const orderedSections = strategy.sections.filter(hasContent);

  const renderSection = (sectionType) => {
    switch (sectionType) {
      case "summary":
        return (
          <Section
            title={getSectionTitle(
              "summary",
              sectorConfig
            )}
          >
            <p className="text-sm leading-6 whitespace-pre-line">
              {resume.summary}
            </p>
          </Section>
        );

      case "skills":
        return (
          <Section
            title={getSectionTitle(
              "skills",
              sectorConfig
            )}
          >
            <p className="text-sm leading-6">
              {resume.skills
                .filter((skill) =>
                  String(skill || "").trim()
                )
                .join(" • ")}
            </p>
          </Section>
        );

      case "experience":
        return (
          <Section
            title={getSectionTitle(
              "experience",
              sectorConfig
            )}
          >
            <div className="space-y-5">
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
                        <h3 className="font-bold">
                          {item.jobTitle || "Position"}
                        </h3>

                        <p className="text-sm text-slate-600">
                          {item.company}

                          {item.location &&
                            ` • ${item.location}`}
                        </p>
                      </div>

                      {(item.startDate ||
                        item.endDate) && (
                        <p className="text-sm text-slate-600">
                          {item.startDate}

                          {item.startDate &&
                            item.endDate &&
                            " – "}

                          {item.endDate}
                        </p>
                      )}
                    </div>

                    {item.description && (
                      <p className="text-sm leading-6 mt-2 whitespace-pre-line">
                        {item.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </Section>
        );

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
                    <div className="flex flex-wrap justify-between gap-2">
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
                      <p className="text-sm text-slate-600 mt-1">
                        <strong>
                          Technologies:
                        </strong>{" "}
                        {project.technologies}
                      </p>
                    )}

                    {project.description && (
                      <p className="text-sm leading-6 mt-2 whitespace-pre-line">
                        {project.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </Section>
        );

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
                      <p className="text-sm text-slate-600">
                        {item.year}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </Section>
        );

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
                        <strong>
                          {item.name}
                        </strong>

                        {item.issuer && (
                          <span className="text-slate-600">
                            {" "}— {item.issuer}
                          </span>
                        )}
                      </div>

                      {item.year && (
                        <span className="text-slate-600">
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

                  if (!text.trim()) {
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
    <div className="bg-white text-slate-900 px-8 sm:px-12 py-10 min-h-[1100px] font-sans">

      {/* HEADER */}
      <header className="border-b-2 border-slate-900 pb-5 text-center">

        <h1 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight">
          {personal.name || "Your Name"}
        </h1>

        <div className="mt-2 text-sm text-slate-600 flex flex-wrap justify-center gap-x-3 gap-y-1">
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

        <div className="mt-1 text-sm text-blue-700 flex flex-wrap justify-center gap-x-3 gap-y-1">
          {personal.linkedin && (
            <span>{personal.linkedin}</span>
          )}

          {personal.github && (
            <span>{personal.github}</span>
          )}
        </div>

      </header>

      {/* DYNAMIC SECTIONS */}
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

      <h2 className="text-base font-bold uppercase tracking-wide border-b border-slate-300 pb-1.5 mb-3">
        {title}
      </h2>

      {children}

    </section>
  );
}

export default ATSClassic;
