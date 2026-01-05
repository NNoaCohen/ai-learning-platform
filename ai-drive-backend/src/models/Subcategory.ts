import { timeStamp } from "console";
import mongoose, { Schema, Document,Types } from "mongoose";

export interface ISubcategory extends Document{
    name: string;
    categoryId: Types.ObjectId; // reference ל-Category
}

const subcategorySchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }
    }
);
export default mongoose.model<ISubcategory>("Subcategory", subcategorySchema);
