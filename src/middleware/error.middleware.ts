import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: err.message || "Internal Server Error" });
};

export default errorMiddleware;
