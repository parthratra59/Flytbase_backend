import mongoose, { Types, Schema } from "mongoose";

export interface MissionModel extends Document {
  alt: number;
  speed: number;
  name: string;
  waypoints: [
    {
      altitude: number;
      latitude: number;
      longitude: number;
    }
  ];

  droneID: Types.ObjectId;
  siteID: Types.ObjectId;
  userID: Types.ObjectId;
  categoryID: Types.ObjectId | null;
}

const MissionSchema: Schema<MissionModel> = new Schema(
  {
    alt: { type: Number, required: true ,trim: true },
    speed: { type: Number, required: true, trim: true },
    name: { type: String, required: true, trim:true , unique: true },
    waypoints: [
      {
        altitude: { type: Number, required: true ,trim: true },
        latitude: { type: Number, required: true , trim: true },
        longitude: { type: Number, required: true, trim: true },
      },
    ],

    droneID: { type: Schema.Types.ObjectId, ref: "Drone", required: true },
    siteID: { type: Schema.Types.ObjectId, ref: "Sites", required: true },
    userID: { type: Schema.Types.ObjectId, ref: "User", required: true },
    categoryID: {
      type: Schema.Types.ObjectId,
      // required: true,
      ref: "Categories",
      default: null,
      
    },
  },
  {
    timestamps: true,
  }
);



export const Mission = mongoose.model("Mission", MissionSchema);
