import { Request, Response } from "express";
import * as promptService from "../services/promptService";

interface AuthRequest extends Request {
    userId?: string;
    role?: "user" | "admin";
}


export const addPrompt = async (req: Request, res: Response) => {
        const { userId, categoryId, subcategoryId, promptText } = req.body;
        const prompt = await promptService.addPrompt({ userId, categoryId, subcategoryId, promptText });
        res.status(201).json({
            success: true,
            data: prompt,
            message: "Prompt created and AI response saved"
        });

};
export const deletePrompt = async (req: AuthRequest, res: Response) => {
    const { promptId } = req.params;

    if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const deletedPrompt = await promptService.deletePrompt({
        promptId,
        userId: req.userId,
    });

    res.status(200).json({
        success: true,
        data: deletedPrompt,
        message: "Prompt deleted successfully",
    });
};

