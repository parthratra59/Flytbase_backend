import mongoose, { Types, Document, Schema } from "mongoose";

export interface SitesModel extends Document {
  site_name: string;
  position: {
    latitude: number;
    longitude: number;
  };
  drones: Types.ObjectId[] | null;
  missions: Types.ObjectId[] | null;
  userID: Types.ObjectId | null;
}

const SitesSchema: Schema<SitesModel> = new Schema(
  {
    site_name: { type: String, required: true, unique: true, index: true,trim:true },
    position: {
      latitude: {
        type: Number,
        trim:true,
        required: true,
        min: -90,
        max: 90,
      },
      longitude: {
        type: Number,
        trim:true,
        required: true,
        min: -180,
        max: 180,
      },
    },
    drones: [{ type: mongoose.Schema.ObjectId, ref: "Drone",default:null }],
    missions: [{ type: mongoose.Schema.ObjectId, ref: "Mission",default:null }],
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,

    }
  },
  {
    timestamps: true,
  }
);

export const Sites = mongoose.model<SitesModel>("Site", SitesSchema);
