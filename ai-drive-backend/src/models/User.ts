
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  phone: string;
  password: string;
  role: string;
  promptHistory: mongoose.Types.ObjectId[];
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    promptHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Prompt" }],
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
