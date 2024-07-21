import mongoose, { Document, Schema, Types, mongo } from "mongoose";

export default interface DroneModel extends Document {
  droneID: string;

  deleted_by: Types.ObjectId | null;
  deleted_on: Date | null;
  drone_type: string;
  make_name: string;
  name: string;

  userID: Types.ObjectId | null;
  siteID: Types.ObjectId | null;
  missionID: Types.ObjectId | null;
  categoryID: Types.ObjectId | null; 
}

const droneSchema: Schema<DroneModel> = new Schema(
  {
    droneID: { type: String, required: true, unique: true },

    deleted_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    deleted_on: { type: Date, default: null },
    drone_type: { type: String, required: true,trim:true },
    make_name: { type: String, trim:true, required: true },
    name: { type: String,trim:true, required: true},

    siteID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
      default: null,
      // required: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    missionID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mission",
      default: null,
    },
    categoryID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Drone = mongoose.model("Drone", droneSchema);
