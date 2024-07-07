import { Schema, model } from "mongoose";
const CategorySchema = new Schema({
    name: { type: String, required: true },
    color: { type: String, required: true },
    tag_name: { type: String, required: true },
}, {
    timestamps: true,
});
export const Category = model("Categories", CategorySchema);
