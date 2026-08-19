import { getResumeStrategy } from "../../resume-config/resumeStrategy";

function ResumeSections({
  resume,
  sections,
}) {
  const strategy = getResumeStrategy(resume);

  return strategy.sections
    .map((sectionType) => sections[sectionType])
    .filter(Boolean);
}

export default ResumeSections;