import mongoose, { Schema, Document } from "mongoose";

export interface IPrompt extends Document {
    userId: mongoose.Types.ObjectId;
    categoryId: mongoose.Types.ObjectId;
    subcategoryId: mongoose.Types.ObjectId;
    promptText: string;
    response: string;
    createdAt: Date;
}

const promptSchema: Schema = new Schema(
    {
        userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
        categoryId: { type: mongoose.Types.ObjectId, ref: "Category", required: true },
        subcategoryId: { type: mongoose.Types.ObjectId, ref: "Subcategory", required: true },
        promptText: { type: String, required: true },
        response: { type: String, default: "" },
    },
    { timestamps: true }
);
export default mongoose.model<IPrompt>("Prompt", promptSchema);