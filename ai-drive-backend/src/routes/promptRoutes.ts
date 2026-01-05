import express from "express";
import { addPrompt, deletePrompt } from "../controllers/promptController";
import { validateObjectId } from "../middlewares/validateObjectId";
import { validateExists } from "../middlewares/validateExists";
import UserModel from "../models/User";
import CategoryModel from "../models/Category";
import SubcategoryModel from "../models/Subcategory";
import { authMiddleware } from "../middlewares/authMiddleware";


const router = express.Router();

router.post("/add", authMiddleware, validateObjectId("userId"),
    validateObjectId("categoryId"),
    validateObjectId("subcategoryId"),
    validateExists("userId", UserModel, "User"),
    validateExists("categoryId", CategoryModel, "Category"),
    validateExists("subcategoryId", SubcategoryModel, "Subcategory"),
    addPrompt);
router.delete(
    "/:promptId",
    authMiddleware,
    validateObjectId("promptId"),
    deletePrompt
);

export default router;
