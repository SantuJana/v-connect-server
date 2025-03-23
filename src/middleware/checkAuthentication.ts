import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

export const checkAuthentication = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const bearer = req.headers?.authorization as string;
  const token = bearer && bearer.replace("Bearer ", "");

  if (token) {
    try {
      const payload: any = await jwt.verify(
        token,
        process.env.JWT_SECRET || ""
      );
      if (payload) {
        req.user = payload;
        next();
        return;
      }
    } catch (error) {
    }
  }

  res.status(401).json({
    status: "Unauthorized",
    code: 401,
    msg: "Invalid user",
  });
  return;
};
