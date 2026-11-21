import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProfile extends Document {
  name: string;
  professionalTitle: string;
  heroHeadline: string;
  heroSubheadline?: string;
  heroIntroduction: string;
  profileImageUrl?: string;
  profileImagePublicId?: string;
  resumeUrl?: string;
  location?: string;
  email?: string;
  phone?: string;
  availabilityStatus?: string;
  yearsOfExperience?: number;
  highlightStats: Array<{
    label: string;
    value: string;
    order: number;
  }>;
  isHeroImageVisible: boolean;
  heroImagePosition: "left" | "right" | "center";
  enableTypingEffect: boolean;
  typingWords?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema = new Schema<IProfile>(
  {
    name: { type: String, required: true, trim: true },
    professionalTitle: { type: String, required: true, trim: true },
    heroHeadline: { type: String, required: true, trim: true },
    heroSubheadline: { type: String, trim: true },
    heroIntroduction: { type: String, required: true },
    profileImageUrl: { type: String },
    profileImagePublicId: { type: String },
    resumeUrl: { type: String },
    location: { type: String, trim: true },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    availabilityStatus: { type: String, default: "Available for new opportunities" },
    yearsOfExperience: { type: Number, default: 0 },
    highlightStats: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
        order: { type: Number, default: 0 },
      },
    ],
    isHeroImageVisible: { type: Boolean, default: true },
    heroImagePosition: {
      type: String,
      enum: ["left", "right", "center"],
      default: "right",
    },
    enableTypingEffect: { type: Boolean, default: true },
    typingWords: [{ type: String }],
  },
  { timestamps: true }
);

export const Profile: Model<IProfile> =
  mongoose.models.Profile || mongoose.model<IProfile>("Profile", ProfileSchema);
