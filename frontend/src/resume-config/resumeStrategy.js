import { getSectorConfig } from "./sectorConfigs";

export function getCandidateLevel(resume) {
  const experience = Array.isArray(resume?.experience)
    ? resume.experience
    : [];

  const validExperience = experience.filter(
    (item) =>
      item?.jobTitle ||
      item?.company ||
      item?.description
  );

  if (validExperience.length === 0) {
    return "fresher";
  }

  return "experienced";
}

export function getResumeStrategy(resume) {
  const sector = resume?.sector || "general";

  const config = getSectorConfig(sector);

  const level = getCandidateLevel(resume);

  const orderedSections =
    config.sectionOrder[level] ||
    config.sectionOrder.experienced;

  return {
    sector,
    level,
    config,
    sections: orderedSections,
  };
}
