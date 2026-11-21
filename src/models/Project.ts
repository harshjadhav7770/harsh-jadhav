import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IProjectScreenshot {
  imageUrl: string;
  publicId?: string;
  caption: string;
  description?: string;
  order: number;
}

export interface IProject extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  problemStatement?: string;
  solutionStatement?: string;
  keyFeatures: string[];
  technologies: string[];
  categoryId: Types.ObjectId;
  projectType: "Personal" | "Client" | "Open Source" | "Academic";
  heroImageUrl?: string;
  heroImagePublicId?: string;
  screenshots: IProjectScreenshot[];
  liveUrl?: string;
  sourceUrl?: string;
  startDate?: string;
  endDate?: string;
  isFeatured: boolean;
  isPublished: boolean;
  order: number;
  seoTitle?: string;
  seoDescription?: string;
  challengesAndLearnings?: string;
  isSampleData: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectScreenshotSchema = new Schema<IProjectScreenshot>(
  {
    imageUrl: { type: String, required: true },
    publicId: { type: String },
    caption: { type: String, required: true },
    description: { type: String },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    problemStatement: { type: String },
    solutionStatement: { type: String },
    keyFeatures: [{ type: String }],
    technologies: [{ type: String, required: true }],
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "ProjectCategory",
      required: true,
      index: true,
    },
    projectType: {
      type: String,
      enum: ["Personal", "Client", "Open Source", "Academic"],
      default: "Personal",
    },
    heroImageUrl: { type: String },
    heroImagePublicId: { type: String },
    screenshots: [ProjectScreenshotSchema],
    liveUrl: { type: String, trim: true },
    sourceUrl: { type: String, trim: true },
    startDate: { type: String },
    endDate: { type: String },
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    seoTitle: { type: String },
    seoDescription: { type: String },
    challengesAndLearnings: { type: String },
    isSampleData: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
