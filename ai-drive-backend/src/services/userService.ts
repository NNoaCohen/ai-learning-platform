import UserModel from "../models/User";
import PromptModel from "../models/Prompt";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
interface IUserInput {
    name: string;
    phone: string;
    password: string;
    role?: "user" | "admin";
}

export const createUser = async ({ name, phone, password,role }: IUserInput) => {
    const existingUser = await UserModel.findOne({ name, phone });
    if (existingUser) {
        throw { status: 409, message: "User already exists" };
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({ name, phone, password: hashedPassword ,role: role || "user"});
    return user;
};

export const loginUser = async (phone: string, password: string) => {
    const user = await UserModel.findOne({ phone });
    if (!user) throw { status: 404, message: "User not found" };
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw { status: 401, message: "The password is incorrect." };
    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET as string,
        { expiresIn: "1d" }
    );

    return {
        user,
        token,
    };
};

export const getUserHistory = async (userId: string) => {

    const user = await UserModel.findById(userId).select("promptHistory");

    if (!user) throw { status: 404, message: "User not found" };

    if (!user.promptHistory || user.promptHistory.length === 0) {
        return [];
    }

    // רק אם יש רשומות, עושים populate
    const populatedUser = await UserModel.populate(user, {
        path: "promptHistory",
        model: PromptModel,
        options: { maxTimeMS: 5000 } // timeout אחרי 5 שניות
    });

    console.log("User history fetched:", populatedUser.promptHistory.length);
    return populatedUser.promptHistory;
}
export const getUserDetailes = async (userId: string) => {
    const user = await UserModel.findById(userId);
    return user;
}

export const getUsers = async () => {
    const users = await UserModel.find();
    return users;
}