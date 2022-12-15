import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import BussinessError from "../utils/BussinessError";

const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let status = StatusCodes.INTERNAL_SERVER_ERROR;
  if (err instanceof BussinessError) {
    status = StatusCodes.BAD_REQUEST;
  }
  return res.status(status).json({
    message: err.message || "Internal Server Error",
  });
};

export default errorMiddleware;
