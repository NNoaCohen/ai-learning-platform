import mongoose from "mongoose";
import bcrypt from "bcrypt";
import UserModel from "../models/User";

async function seedAdmin() {
  await mongoose.connect("mongodb://localhost:27017/ai_drive");
  
  const hashedPassword = await bcrypt.hash("admin123", 10);
  
  const adminUser = {
    name: "Admin User",
    phone: "0501234567",
    password: hashedPassword,
    role: "admin"
  };

  const existingAdmin = await UserModel.findOne({ phone: adminUser.phone });
  if (!existingAdmin) {
    await UserModel.create(adminUser);
    console.log("Admin user created successfully!");
  } else {
    console.log("Admin user already exists");
  }

  process.exit(0);
}

seedAdmin();