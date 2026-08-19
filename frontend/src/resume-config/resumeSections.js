export const resumeSectionDefinitions = {
  summary: {
    type: "summary",
    defaultTitle: "Professional Summary",
  },

  skills: {
    type: "skills",
    defaultTitle: "Skills",
  },

  experience: {
    type: "experience",
    defaultTitle: "Professional Experience",
  },

  projects: {
    type: "projects",
    defaultTitle: "Projects",
  },

  education: {
    type: "education",
    defaultTitle: "Education",
  },

  certifications: {
    type: "certifications",
    defaultTitle: "Certifications",
  },

  achievements: {
    type: "achievements",
    defaultTitle: "Achievements",
  },
};

export function getSectionTitle(sectionType, config) {
  const defaultTitle =
    resumeSectionDefinitions[sectionType]?.defaultTitle ||
    sectionType;

  if (!config?.titles) {
    return defaultTitle;
  }

  return config.titles[sectionType] || defaultTitle;
}
