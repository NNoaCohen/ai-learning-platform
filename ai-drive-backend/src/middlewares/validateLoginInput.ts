import { Request, Response, NextFunction } from "express";

export const validateLoginInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { phone, password } = req.body;

  // phone
  if (typeof phone !== "string" || !/^\d{10}$/.test(phone)) {
    return res.status(400).json({
      message: "Phone is required and must be a 10-digit string",
    });
  }

  // password
  if (!password || typeof password !== "string") {
    return res.status(400).json({
      message: "Password is required and must be a string",
    });
  }

  next();
};
