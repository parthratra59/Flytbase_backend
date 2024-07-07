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

  drone_id: string;
  site: Types.ObjectId;
  category: Types.ObjectId;
}

const MissionSchema: Schema<MissionModel> = new Schema(
  {
    alt: { type: Number, required: true },
    speed: { type: Number, required: true },
    name: { type: String, required: true },
    waypoints: [
      {
        altitude: { type: Number, required: true },
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
      },
    ],

    drone_id: { type: String, ref: "Drone", required: true },
    site: { type: Schema.Types.ObjectId, ref: "Sites", required: true },
    category: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Categories",
    },
  },
  {
    timestamps: true,
  }
);

export const Mission = mongoose.model("Mission", MissionSchema);
