import express from "express";
import { addSubcategory,getSubcategories } from "../controllers/subcategoryController";
import { validateObjectId } from "../middlewares/validateObjectId";
import { validateExists } from "../middlewares/validateExists";
import CategoryModel from "../models/Category";

const router = express.Router();

router.get("/", getSubcategories);
router.put("/add",validateObjectId("categoryId"),
    validateExists("categoryId", CategoryModel, "Category"), addSubcategory);
export default router;
