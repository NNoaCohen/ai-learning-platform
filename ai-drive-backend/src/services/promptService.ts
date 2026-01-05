import PromptModel from "../models/Prompt";
import UserModel from "../models/User";
import CategoryModel from "../models/Category";
import SubcategoryModel from "../models/Subcategory";
import { sendPromptToOpenAI } from "./openAIService";

interface IPromptInput {
    userId: string;
    categoryId: string;
    subcategoryId: string;
    promptText: string;
};
interface DeletePromptInput {
    promptId: string;
    userId: string;
};
export const addPrompt = async ({ userId, categoryId, subcategoryId, promptText }: IPromptInput) => {
    try {
        const category = await CategoryModel.findById(categoryId);
        const subcategory = await SubcategoryModel.findById(subcategoryId);
        {
            if (!category || !subcategory) {
                throw new Error("Category or subcategory not found");
            }
            const aiResponse = await sendPromptToOpenAI(category.name, subcategory.name, promptText);
            const prompt = await PromptModel.create({
                userId,
                categoryId,
                subcategoryId,
                promptText,
                response: aiResponse
            });


            await UserModel.findByIdAndUpdate(userId, {
                $push: { promptHistory: prompt._id }
            });
            return prompt;
        }
    }
    catch (err) {
            console.log(err);
            throw err;
        }
    };
    export const getPrompts = async () => {
    const prompts = await PromptModel.find().populate("userId categoryId subcategoryId");
    return prompts;
    }
    export const deletePrompt = async ({ promptId, userId }: DeletePromptInput) => {
    const deletedPrompt = await PromptModel.findOneAndDelete({
        _id: promptId,
        userId: userId, 
    });

    if (!deletedPrompt) {
        throw { status: 404, message: "Prompt not found" };
    }

    await UserModel.findByIdAndUpdate(userId, {
        $pull: { promptHistory: promptId },
    });

    return deletedPrompt;
};