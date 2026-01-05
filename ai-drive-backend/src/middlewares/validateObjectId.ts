// middlewares/validateObjectId.ts
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export const validateObjectId = (param: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const id = req.params[param] || req.body[param] || req.query[param];
       if (!id) {
      return res.status(400).json({ message: `${param} is required` });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    next();
  };
};
