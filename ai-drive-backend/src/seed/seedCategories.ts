import mongoose from "mongoose";
import CategoryModel, { ICategory } from "../models/Category";
import SubcategoryModel, { ISubcategory } from "../models/Subcategory";

const categories = [
  { name: "Science", subcategories: ["Space", "Physics", "Biology"] },
  { name: "Math", subcategories: ["Algebra", "Geometry", "Calculus"] },
];

async function seed() {
  await mongoose.connect("mongodb://localhost:27017/ai_drive");
  
  for (const cat of categories) {
    const categoryDoc = await CategoryModel.create({ name: cat.name });
    for (const sub of cat.subcategories) {
      await SubcategoryModel.create({ name: sub, categoryId: categoryDoc._id });
    }
  }

  console.log("Seeding done!");
  process.exit(0);
}

seed();
