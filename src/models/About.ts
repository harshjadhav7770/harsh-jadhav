import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAbout extends Document {
  biography: string;
  secondaryBio?: string;
  profileImageUrl?: string;
  profileImagePublicId?: string;
  interests: string[];
  learningApproach: {
    philosophy: string;
    practicalProcess: string;
    problemSolving: string;
    projectBased: string;
    continuousLearning: string;
  };
  publicFieldToggles: {
    showEmail: boolean;
    showPhone: boolean;
    showLocation: boolean;
    showExperienceYears: boolean;
  };
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AboutSchema = new Schema<IAbout>(
  {
    biography: { type: String, required: true },
    secondaryBio: { type: String },
    profileImageUrl: { type: String },
    profileImagePublicId: { type: String },
    interests: [{ type: String }],
    learningApproach: {
      philosophy: { type: String, default: "" },
      practicalProcess: { type: String, default: "" },
      problemSolving: { type: String, default: "" },
      projectBased: { type: String, default: "" },
      continuousLearning: { type: String, default: "" },
    },
    publicFieldToggles: {
      showEmail: { type: Boolean, default: true },
      showPhone: { type: Boolean, default: false },
      showLocation: { type: Boolean, default: true },
      showExperienceYears: { type: Boolean, default: true },
    },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const About: Model<IAbout> =
  mongoose.models.About || mongoose.model<IAbout>("About", AboutSchema);
