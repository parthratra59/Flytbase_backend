import mongoose, { Schema, model, Document, Types } from "mongoose";

export interface CategoryModel extends Document {
  name: string;
  color: string;
  tag_name: string;
  userID: Types.ObjectId |  null; // Add User ID here
  missions: [Types.ObjectId]  ;
  drones: [Types.ObjectId]; // Add Drone ID here
}

const CategorySchema: Schema<CategoryModel> = new Schema(
  {
    name: { type: String, required: true, trim: true ,unique:true},
    color: { type: String, required: true, trim: true },
    tag_name: { type: String, required: true, trim: true },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default :null
    },
    missions: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Missions", default: null }, // Add Mission ID here
    ],
    drones: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Drone", default: null }, // Add Drone ID here
    ],
  },
  {
    timestamps: true,
  }
);

export const Category = model<CategoryModel>("Category", CategorySchema);
