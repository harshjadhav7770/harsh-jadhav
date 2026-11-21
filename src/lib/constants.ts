export const SKILLHUB_META = {
  organization: "SKILLHUB IT SOLUTION",
  author: "Akash Dhone",
  brandCredit: "Built with SKILLHUB",
  website: "https://www.skillhubdev.com",
  version: "1.0.0",
} as const;

export const INITIAL_SKILL_CATEGORIES = [
  { name: "Programming Languages", slug: "programming-languages", order: 1 },
  { name: "Frontend Development", slug: "frontend-development", order: 2 },
  { name: "Backend Development", slug: "backend-development", order: 3 },
  { name: "Mobile Development", slug: "mobile-development", order: 4 },
  { name: "Databases", slug: "databases", order: 5 },
  { name: "Data Analytics", slug: "data-analytics", order: 6 },
  { name: "Business Intelligence", slug: "business-intelligence", order: 7 },
  { name: "Cloud & DevOps", slug: "cloud-devops", order: 8 },
  { name: "Tools & Platforms", slug: "tools-platforms", order: 9 },
  { name: "Other Technologies", slug: "other-technologies", order: 10 },
] as const;

export const INITIAL_PROJECT_CATEGORIES = [
  { name: "Web", slug: "web", order: 1 },
  { name: "Mobile", slug: "mobile", order: 2 },
  { name: "Analytics", slug: "analytics", order: 3 },
  { name: "Power BI", slug: "power-bi", order: 4 },
  { name: "SQL", slug: "sql", order: 5 },
] as const;

export const INITIAL_SOCIAL_PLATFORMS = [
  { platform: "LinkedIn", iconName: "Linkedin" },
  { platform: "GitHub", iconName: "Github" },
  { platform: "Instagram", iconName: "Instagram" },
  { platform: "Facebook", iconName: "Facebook" },
  { platform: "X", iconName: "Twitter" },
  { platform: "YouTube", iconName: "Youtube" },
  { platform: "Personal Website", iconName: "Globe" },
] as const;
