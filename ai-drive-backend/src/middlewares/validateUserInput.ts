import { Request, Response, NextFunction } from "express";

export const validateUserInput = (req: Request, res: Response, next:NextFunction)=>{
    const {name,phone} = req.body;
    if(!name || typeof name !== "string"){
        return res.status(400).json({message: "Name is required and must be a string"});
    }
        if(typeof phone !== "string" || !/^\d{10}$/.test(phone)){
        return res.status(400).json({message: "Phone is required and must be 10 digits"});
    }
    next();
}