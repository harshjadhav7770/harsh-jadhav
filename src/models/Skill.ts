import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ISkill extends Document {
  name: string;
  categoryId: Types.ObjectId;
  iconName?: string;
  proficiencyLevel: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  proficiencyPercent: number;
  yearsOfExperience?: number;
  shortDescription?: string;
  order: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true, trim: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "SkillCategory",
      required: true,
      index: true,
    },
    iconName: { type: String, default: "Code" },
    proficiencyLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
      default: "Advanced",
    },
    proficiencyPercent: { type: Number, min: 0, max: 100, default: 85 },
    yearsOfExperience: { type: Number, default: 1 },
    shortDescription: { type: String },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Skill: Model<ISkill> =
  mongoose.models.Skill || mongoose.model<ISkill>("Skill", SkillSchema);
