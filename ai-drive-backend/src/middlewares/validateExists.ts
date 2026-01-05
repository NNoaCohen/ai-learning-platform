import { Request, Response, NextFunction } from "express";

export const validateExists = (param: string, model: any, name: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params[param] || req.body[param];
        const exists = await model.findById(id);
        if (!exists) {
            return res.status(404).json({ message: `${name} not found` });
        }
        next();
    }
};