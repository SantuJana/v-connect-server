import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/user.model";

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({
      code: 400,
      status: "error",
      msg: "Name, Email and Password are mandatory",
    });
    return;
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400).json({
      code: 400,
      status: "error",
      msg: "Already have an account",
    });
    return;
  }

  const user = await User.create(req.body);
  delete user.password;
  res.status(200).json({
    code: 400,
    status: "success",
    data: user,
    msg: "Registration successful",
  });
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
    name: existingUser.name,
    email: existingUser.email,
    image: existingUser.image,
  };
  res.status(200).json({
    code: 200,
    status: "success",
    data,
    token,
  });
  return;
};
