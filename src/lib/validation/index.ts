import { z } from "zod";

export const EnvSchema = z.object({
  SKILLHUB_APP_NAME: z.string().default("SKILLHUB Portfolio"),
  SKILLHUB_APP_AUTHOR: z.string().default("Akash Dhone"),
  SKILLHUB_APP_URL: z.string().default("http://localhost:3000"),
  SKILLHUB_APP_VERSION: z.string().default("1.0.0"),
  SKILLHUB_MONGODB_URI: z.string().min(1, "MongoDB URI is required"),
  SKILLHUB_AUTH_SECRET: z
    .string()
    .min(32, "Auth secret must be at least 32 characters long"),
  SKILLHUB_CLOUDINARY_CLOUD_NAME: z.string().min(1, "Cloudinary Cloud Name is required"),
  SKILLHUB_CLOUDINARY_API_KEY: z.string().min(1, "Cloudinary API Key is required"),
  SKILLHUB_CLOUDINARY_API_SECRET: z.string().min(1, "Cloudinary API Secret is required"),
  SKILLHUB_GMAIL_USER: z.string().email().optional().or(z.literal("")),
  SKILLHUB_GMAIL_APP_PASSWORD: z.string().optional(),
  SKILLHUB_ADMIN_EMAIL: z.string().email().optional().or(z.literal("")),
  SKILLHUB_DEFAULT_THEME: z.enum(["system", "dark", "light"]).default("system"),
});

export const AdminSetupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    mobile: z.string().min(10, "Mobile number must be at least 10 digits").optional().or(z.literal("")),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
    portfolioType: z.enum(["data-analytics", "full-stack", "both"]),
    installationType: z.enum(["express", "full"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const AdminLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const ContactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  mobile: z.string().max(20).optional().or(z.literal("")),
  subject: z.string().min(3, "Subject must be at least 3 characters").max(200),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
  honeypot: z.string().max(0, "Spam detected").optional().or(z.literal("")),
});

export const ProfileUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  professionalTitle: z.string().min(2, "Title is required"),
  heroHeadline: z.string().min(2, "Headline is required"),
  heroSubheadline: z.string().optional(),
  heroIntroduction: z.string().min(10, "Introduction must be at least 10 characters"),
  profileImageUrl: z.string().optional(),
  profileImagePublicId: z.string().optional(),
  resumeUrl: z.string().optional(),
  location: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  availabilityStatus: z.string().optional(),
  yearsOfExperience: z.coerce.number().min(0).default(0),
  isHeroImageVisible: z.boolean().default(true),
  heroImagePosition: z.enum(["left", "right", "center"]).default("right"),
  enableTypingEffect: z.boolean().default(true),
  typingWords: z.array(z.string()).optional(),
  highlightStats: z
    .array(
      z.object({
        _id: z.any().optional(),
        label: z.string().min(1, "Label is required"),
        value: z.string().min(1, "Value is required"),
        order: z.number().default(0),
      })
    )
    .optional(),
});

export const ProjectSchemaValidation = z.object({
  title: z.string().min(2, "Project title is required"),
  slug: z.string().min(2, "Slug is required"),
  shortDescription: z.string().min(10, "Short description is required"),
  fullDescription: z.string().min(20, "Full description is required"),
  problemStatement: z.string().optional(),
  solutionStatement: z.string().optional(),
  keyFeatures: z.array(z.string()).default([]),
  technologies: z.array(z.string()).min(1, "Select at least one technology"),
  categoryId: z.string().min(1, "Project category is required"),
  projectType: z.enum(["Personal", "Client", "Open Source", "Academic"]).default("Personal"),
  heroImageUrl: z.string().optional(),
  heroImagePublicId: z.string().optional(),
  screenshots: z
    .array(
      z.object({
        imageUrl: z.string(),
        publicId: z.string().optional(),
        caption: z.string(),
        description: z.string().optional(),
        order: z.number().default(0),
      })
    )
    .default([]),
  liveUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  sourceUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  order: z.coerce.number().default(0),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  challengesAndLearnings: z.string().optional(),
});

export const SkillSchemaValidation = z.object({
  name: z.string().min(1, "Skill name is required"),
  categoryId: z.string().min(1, "Category is required"),
  iconName: z.string().default("Code"),
  proficiencyLevel: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"]).default("Advanced"),
  proficiencyPercent: z.coerce.number().min(0).max(100).default(80),
  yearsOfExperience: z.coerce.number().min(0).optional(),
  shortDescription: z.string().optional(),
  order: z.coerce.number().default(0),
  isVisible: z.boolean().default(true),
});

export const ExperienceSchemaValidation = z.object({
  companyName: z.string().min(2, "Company name is required"),
  jobTitle: z.string().min(2, "Job title is required"),
  employmentType: z.enum(["Full-time", "Part-time", "Contract", "Internship", "Freelance"]),
  location: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  isCurrent: z.boolean().default(false),
  responsibilities: z.array(z.string()).default([]),
  achievements: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  order: z.coerce.number().default(0),
  isVisible: z.boolean().default(true),
});
