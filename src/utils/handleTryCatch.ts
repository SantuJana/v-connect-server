import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/checkAuthentication";

type asyncHandler = (
  req: Request | AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => Promise<any>;

const handleTryCatch = (func: asyncHandler) => {
  return (
    req: Request | AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    func(req, res, next).catch((error) => {
      console.log("+++++", error.message);
      next(error);
    });
  };
};

export default handleTryCatch;
