import express from "express";
import { getUserHistory, getUsers, loginUser, registerUser } from "../controllers/userController";
import { validateUserInput } from "../middlewares/validateUserInput";
import { validateObjectId } from "../middlewares/validateObjectId";
import { validateRegisterInput } from "../middlewares/validateRegisterInput";
import { validateLoginInput } from "../middlewares/validateLoginInput";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/register", validateRegisterInput, registerUser);
router.post("/login", validateLoginInput, loginUser);
router.get("/:id/history", validateObjectId("id"), authMiddleware, getUserHistory);
router.get("/", authMiddleware, getUsers);
export default router;
