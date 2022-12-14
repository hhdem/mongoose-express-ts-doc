import { Response, NextFunction } from "express";
import DocService from "../services/doc.service";
import Request from "../types/Request";

export default async function checkDocBeforeSave(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { docId } = req.body;
  if (!docId) {
    throw new Error("Parameter docId is required.");
  } else {
    const isDocExist: Boolean = await DocService.isDocExist(docId);
    if (!isDocExist) {
      throw new Error("Doc is not exists.");
    }
  }
  next();
}
