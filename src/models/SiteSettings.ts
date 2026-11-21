import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISiteSettings extends Document {
  siteTitle: string;
  siteTagline?: string;
  siteDescription?: string;
  faviconUrl?: string;
  logoUrl?: string;
  defaultTheme: "system" | "dark" | "light";
  accentColor: string;
  enableAnimations: boolean;
  sectionsConfig: {
    hero: { isVisible: boolean; order: number };
    about: {
      isVisible: boolean;
      order: number;
      heading?: string;
      subheading?: string;
      buttonText?: string;
    };
    skills: {
      isVisible: boolean;
      order: number;
      heading?: string;
      subheading?: string;
      buttonText?: string;
    };
    projects: {
      isVisible: boolean;
      order: number;
      heading?: string;
      subheading?: string;
      buttonText?: string;
    };
    experience: {
      isVisible: boolean;
      order: number;
      heading?: string;
      subheading?: string;
    };
    contact: {
      isVisible: boolean;
      order: number;
      heading?: string;
      subheading?: string;
      buttonText?: string;
    };
  };
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    ogImageUrl?: string;
  };
  footerAttribution: {
    showBrandCredit: boolean;
    brandText: string;
    authorText: string;
    websiteUrl: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    siteTitle: { type: String, default: "Professional Portfolio" },
    siteTagline: { type: String, default: "Full-Stack Engineer & Data Specialist" },
    siteDescription: {
      type: String,
      default: "Personal portfolio powered by SKILLHUB Dynamic Portfolio System",
    },
    faviconUrl: { type: String },
    logoUrl: { type: String },
    defaultTheme: {
      type: String,
      enum: ["system", "dark", "light"],
      default: "system",
    },
    accentColor: { type: String, default: "#2563eb" },
    enableAnimations: { type: Boolean, default: true },
    sectionsConfig: {
      hero: {
        isVisible: { type: Boolean, default: true },
        order: { type: Number, default: 1 },
      },
      about: {
        isVisible: { type: Boolean, default: true },
        order: { type: Number, default: 2 },
        heading: { type: String, default: "Bridging Design, Code, and Analytics" },
        subheading: { type: String, default: "About Me" },
        buttonText: { type: String, default: "Read Full Story & Education" },
      },
      skills: {
        isVisible: { type: Boolean, default: true },
        order: { type: Number, default: 3 },
        heading: { type: String, default: "Technical Mastery" },
        subheading: { type: String, default: "Competencies" },
        buttonText: { type: String, default: "Explore All Skills" },
      },
      projects: {
        isVisible: { type: Boolean, default: true },
        order: { type: Number, default: 4 },
        heading: { type: String, default: "Featured Case Studies" },
        subheading: { type: String, default: "Selected Works" },
        buttonText: { type: String, default: "View All Projects" },
      },
      experience: {
        isVisible: { type: Boolean, default: true },
        order: { type: Number, default: 5 },
        heading: { type: String, default: "Professional Milestones" },
        subheading: { type: String, default: "Career Track" },
      },
      contact: {
        isVisible: { type: Boolean, default: true },
        order: { type: Number, default: 6 },
        heading: { type: String, default: "Interested in Collaborating?" },
        subheading: {
          type: String,
          default:
            "Whether you have a job opportunity, consulting engagement, or technical inquiry, my inbox is always open.",
        },
        buttonText: { type: String, default: "Send a Message" },
      },
    },
    seo: {
      metaTitle: { type: String },
      metaDescription: { type: String },
      keywords: [{ type: String }],
      ogImageUrl: { type: String },
    },
    footerAttribution: {
      showBrandCredit: { type: Boolean, default: true },
      brandText: { type: String, default: "Built with SKILLHUB" },
      authorText: { type: String, default: "Akash Dhone" },
      websiteUrl: { type: String, default: "https://www.skillhubdev.com" },
    },
  },
  { timestamps: true }
);

export const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings ||
  mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
