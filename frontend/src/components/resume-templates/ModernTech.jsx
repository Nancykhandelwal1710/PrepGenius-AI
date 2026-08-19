import { getSectorConfig } from "../../resume-config/sectorConfigs";
import { getSectionTitle } from "../../resume-config/resumeSections";
import { getResumeStrategy } from "../../resume-config/resumeStrategy";

function ModernTech({ resume }) {
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
            title={getSectionTitle("summary", sectorConfig)}
          >
            <p className="text-sm leading-6 text-slate-600">
              {resume.summary}
            </p>
          </Section>
        );

      case "skills":
        return (
          <Section
            title={getSectionTitle("skills", sectorConfig)}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              {resume.skills
                .filter((skill) =>
                  String(skill || "").trim()
                )
                .map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#2457D6]" />
                    <span>{skill}</span>
                  </div>
                ))}
            </div>
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
                  <div
                    key={index}
                    className="relative pl-5 border-l-2 border-[#DCE6FF]"
                  >
                    <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-[#2457D6]" />

                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                      <div>
                        <h3 className="font-bold text-base">
                          {item.jobTitle || "Position"}
                        </h3>

                        <p className="text-sm text-[#2457D6] font-medium">
                          {item.company}

                          {item.location &&
                            ` • ${item.location}`}
                        </p>
                      </div>

                      {(item.startDate ||
                        item.endDate) && (
                        <p className="text-sm text-slate-500">
                          {item.startDate}

                          {item.startDate &&
                            item.endDate &&
                            " – "}

                          {item.endDate}
                        </p>
                      )}
                    </div>

                    {item.description && (
                      <p className="text-sm leading-6 text-slate-600 mt-2 whitespace-pre-line">
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
            <div className="grid grid-cols-1 gap-5">
              {resume.projects.map((project, index) => {
                if (
                  !project?.name &&
                  !project?.description
                ) {
                  return null;
                }

                return (
                  <div
                    key={index}
                    className="border border-slate-200 p-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                      <h3 className="font-bold">
                        {project.name || "Project"}
                      </h3>

                      {project.link && (
                        <span className="text-sm text-[#2457D6]">
                          {project.link}
                        </span>
                      )}
                    </div>

                    {project.technologies && (
                      <p className="text-xs font-semibold text-[#2457D6] mt-2">
                        {project.technologies}
                      </p>
                    )}

                    {project.description && (
                      <p className="text-sm text-slate-600 leading-6 mt-2 whitespace-pre-line">
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

                      <p className="text-sm text-slate-500">
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

      case "certifications":
        return (
          <Section title="Certifications">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                      className="border-l-4 border-[#B8E34B] pl-3"
                    >
                      <p className="text-sm font-semibold">
                        {item.name}
                      </p>

                      <p className="text-xs text-slate-500">
                        {item.issuer}

                        {item.year &&
                          ` • ${item.year}`}
                      </p>
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
    <div className="bg-white text-[#14213D] min-h-[1100px] font-sans">

      {/* HEADER */}
      <header className="bg-[#14213D] text-white px-8 sm:px-12 py-9">

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">

          <div>
            <div className="w-12 h-1 bg-[#B8E34B] mb-4" />

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              {personal.name || "Your Name"}
            </h1>

            <p className="text-[#B8E34B] font-semibold mt-2">
              {personal.title || "Software Engineer"}
            </p>
          </div>

          <div className="text-sm text-white/75 sm:text-right space-y-1">

            {personal.email && (
              <p>{personal.email}</p>
            )}

            {personal.phone && (
              <p>{personal.phone}</p>
            )}

            {personal.location && (
              <p>{personal.location}</p>
            )}

            <div className="flex sm:justify-end gap-3 pt-1">

              {personal.linkedin && (
                <span className="text-[#B8E34B]">
                  {personal.linkedin}
                </span>
              )}

              {personal.github && (
                <span className="text-[#B8E34B]">
                  {personal.github}
                </span>
              )}

            </div>
          </div>

        </div>

      </header>

      {/* DYNAMIC SECTIONS */}
      <div className="px-8 sm:px-12 py-8">
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
    <section className="mb-7">

      <div className="flex items-center gap-3 mb-3">

        <h2 className="text-sm font-black uppercase tracking-[0.14em]">
          {title}
        </h2>

        <div className="h-px flex-1 bg-slate-200" />

      </div>

      {children}

    </section>
  );
}

export default ModernTech;
