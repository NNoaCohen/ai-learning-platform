import axios from "axios";
import { response } from "express";
import { model } from "mongoose";

const systemMessage = {
    role: "system",
    content: "You are an educational AI tutor who explains topics clearly with examples."

};
const buildUserMessage = (
    category: string,
    subcategory: string,
    userPrompt: string
) => {
    return {
        role: "user",
        content: `
Category: ${category}
Subcategory: ${subcategory}

${userPrompt}
`.trim()
    };
};

export const sendPromptToOpenAI = async (
    category: string,
    subcategory: string,
    userPrompt: string
) => {
    if (!process.env.OPENAI_API_KEY) {
        return `Mock lesson about ${userPrompt} in ${category} - ${subcategory}. This is a comprehensive educational response covering the key concepts, practical examples, and important details about the topic. The lesson includes structured explanations suitable for learning purposes.`;
    }

    try {
        console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY);
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4o-mini",
                messages: [
                    systemMessage,
                    buildUserMessage(category, subcategory, userPrompt)
                ],

            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                }
            }

        );

        return response.data.choices[0].message.content;
    }
    catch (error: any) {
        console.error("Error calling OpenAI:", error.response?.data || error.message);
        return `Mock lesson about ${userPrompt} in ${category} - ${subcategory}. OpenAI service is currently unavailable, but here's a structured educational response covering the fundamental concepts and practical applications of the topic.`;
    }
}
