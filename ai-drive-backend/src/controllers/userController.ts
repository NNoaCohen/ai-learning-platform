import { Request, Response } from "express";
import * as  Userservice from "../services/userService";

export const registerUser = async (req: Request, res: Response) => {
    const { name, phone, password,role } = req.body;
    const newUser = await Userservice.createUser({ name, phone, password ,role});
    res.status(201).json(newUser);

};
export const loginUser = async (req: Request, res: Response) => {
    const { phone, password } = req.body;
    const { user, token } = await Userservice.loginUser(phone, password);
    res.status(200).json({
        token,
        user: {
            id: user._id,
            name: user.name,
            phone: user.phone,
            role: user.role
        },
    });
};
export const getUserHistory = async (req: Request, res: Response) => {
    const userId = req.params.id;
    const history = await Userservice.getUserHistory(userId);
    res.status(200).json(history);

}
export const getUsers = async (req: Request, res:Response) => {
    res.status(200).json(await Userservice.getUsers())
}