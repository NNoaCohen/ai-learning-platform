import { Request, Response, NextFunction } from "express";

export const validateRegisterInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, phone, password } = req.body;

  // name
  if (!name || typeof name !== "string") {
    return res
      .status(400)
      .json({ message: "Name is required and must be a string" });
  }

  // phone
  if (typeof phone !== "string" || !/^\d{10}$/.test(phone)) {
    return res
      .status(400)
      .json({ message: "Phone is required and must be 10 digits" });
  }

  // password
  if (!password || typeof password !== "string" || password.length < 6) {
    return res.status(400).json({
      message: "Password is required and must be at least 6 characters",
    });
  }

  next();
};
