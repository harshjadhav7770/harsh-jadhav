import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISkillCategory extends Document {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SkillCategorySchema = new Schema<ISkillCategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: { type: String },
    icon: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const SkillCategory: Model<ISkillCategory> =
  mongoose.models.SkillCategory ||
  mongoose.model<ISkillCategory>("SkillCategory", SkillCategorySchema);
