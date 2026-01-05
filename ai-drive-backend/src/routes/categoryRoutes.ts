import express from "express";
import { addCategory, getCategories } from "../controllers/categoryController";
import { getSubcategories } from "../controllers/subcategoryController";
import CategoryModel from "../models/Category";
import { validateObjectId } from "../middlewares/validateObjectId";
import { validateExists } from "../middlewares/validateExists";


const router = express.Router();

router.get("/", getCategories);
router.put("/add", addCategory);
router.get("/:id",
    validateObjectId("id"),
    validateExists("id", CategoryModel, "Category"),
    getSubcategories);
export default router;
