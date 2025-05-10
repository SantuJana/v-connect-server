import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "./checkAuthentication";
import { sendErrorResponse } from "../utils/sendResponse";

const handleError = (
  error: any,
  req: Request | AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const status = error.status || 500;
  const message = error.message;

  if (status == 500) {
    sendErrorResponse(res, "Internal server error", 500);
  } else {
    sendErrorResponse(res, message, status);
  }
};

export default handleError;