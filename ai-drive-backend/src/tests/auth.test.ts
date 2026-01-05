import { loginUser } from "../services/userService"; 
import UserModel from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Mocking של DB ושל bcrypt
jest.mock("../src/models/UserModel");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("loginUser", () => {
  const mockUser = {
    _id: "12345",
    phone: "0501234567",
    password: "hashedPassword",
  };

  it("should throw 404 if user not found", async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(null);

    await expect(loginUser("0500000000", "anyPassword"))
      .rejects
      .toEqual({ status: 404, message: "User not found" });
  });

  it("should throw 401 if password is incorrect", async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(loginUser(mockUser.phone, "wrongPassword"))
      .rejects
      .toEqual({ status: 401, message: "The password is incorrect." });
  });

  it("should return user and token if login is successful", async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("mockToken");

    const result = await loginUser(mockUser.phone, "correctPassword");

    expect(result).toEqual({
      user: mockUser,
      token: "mockToken",
    });

    // בדיקה שה־token נוצר עם userId הנכון
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: mockUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
  });
});
