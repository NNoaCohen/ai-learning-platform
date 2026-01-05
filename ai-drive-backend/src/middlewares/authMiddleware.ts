import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  // 1️⃣ יש בכלל Authorization?
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  // 2️⃣ פורמט Bearer token
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    // 3️⃣ אימות token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { userId: string };

    // 4️⃣ שמירת userId על הבקשה
    req.userId = decoded.userId;

    // 5️⃣ המשך ל־controller
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
