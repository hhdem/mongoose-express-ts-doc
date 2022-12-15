import { Response, NextFunction } from "express";
import DocService from "../services/doc.service";
import Request from "../types/Request";
import BussinessError from "../utils/BussinessError";

export default async function checkDocExists(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { docId } = req.body;
  if (!docId) {
    throw new BussinessError("Parameter docId is required.");
  } else {
    const isDocExist: Boolean = await DocService.isDocExist(docId);
    if (!isDocExist) {
      throw new BussinessError("Doc is not exists.");
    }
  }
  next();
}
