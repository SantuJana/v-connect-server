import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/user.model";
import { sendErrorResponse, sendSuccessResponse } from "../utils/sendResponse";

export const register = async (req: Request, res: Response) => {
  const { name, email, password, gender } = req.body;

  if (!name || !email || !password || !gender) {
    sendErrorResponse(res, "Name, Email, Date of birth and Password are mandatory", 400);
    return;
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    sendErrorResponse(res, "Already have an account", 400);
    return;
  }

  const user = await User.create(req.body);
  delete user.password;
  sendSuccessResponse(res, user, "Registration successful", 201);
  return;
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      code: 400,
      status: "bad request",
      msg: "Enter email and password",
    });
    return;
  }

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    res.status(401).json({
      code: 401,
      status: "unauthenticated",
      msg: "No user found",
    });
    return;
  }

  const passHas = existingUser.password;
  const passMatched = await bcrypt.compare(password, passHas!);

  if (!passMatched) {
    res.status(401).json({
      code: 401,
      status: "unauthenticated",
      msg: "Invalid credentials",
    });
    return;
  }

  const payload = { id: existingUser._id };
  const token = await jwt.sign(payload, process.env.JWT_SECRET || "");
  let data = {
    _id: existingUser._id,
    name: existingUser.name,
    email: existingUser.email,
    image: existingUser.image,
    city: existingUser.city,
    dob: existingUser.dob,
  };
  res.status(200).json({
    code: 200,
    status: "success",
    data,
    token,
  });
  return;
};
