import mongoose, { Schema } from "mongoose";
const droneSchema = new Schema({
    drone_id: { type: String, required: true, unique: true },
    deleted_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    deleted_on: { type: Date, default: null },
    drone_type: { type: String, required: true, unique: true },
    make_name: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    siteID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sites",
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
});
export const Drone = mongoose.model("Drone", droneSchema);
