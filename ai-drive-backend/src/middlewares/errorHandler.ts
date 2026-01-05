import { Request, Response, NextFunction } from "express";

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(err); 

    const statusCode = err.status || 500; 
    const message = err.message || "Server error";

    res.status(statusCode).json({
        success: false,
        message,
    });
};
