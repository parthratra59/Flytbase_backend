import mongoose, { Types, Document, Schema } from "mongoose";

export interface SitesModel extends Document {
  site_name: string;
  position: {
    latitude: number;
    longitude: number;
  };
  drones: Types.ObjectId[];
}

const SitesSchema: Schema<SitesModel> = new Schema({
  site_name: { type: String, required: true,unique: true,index: true},
  position: {
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },
    
  },
  drones: [{ type: mongoose.Schema.ObjectId, ref: "Drone" }],

}
,{
  timestamps: true,
  

}
);


export const Sites =  mongoose.model<SitesModel>('Sites',SitesSchema);