import { Schema, model, Document } from "mongoose";

export interface CategoryModel extends Document {
  name: string;
  color: string;
  tag_name: string;

}

const CategorySchema: Schema<CategoryModel> = new Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
  tag_name: { type: String, required: true },

}
,{
    timestamps: true,
   
  
});

export const Category = model<CategoryModel>("Categories", CategorySchema);
