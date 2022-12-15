import { Response, NextFunction } from "express";
import ContainerService from "../services/container.service";
import Request from "../types/Request";
import BussinessError from "../utils/BussinessError";
import DocService from "../services/doc.service";

export default async function checkContainerOrDocExists(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { containerId, docId } = req.body;
  if (!containerId && !docId) {
    throw new BussinessError(
      "Parameter containerId or docId is required, we need at least one of them."
    );
  } else if (containerId) {
    const isCanExist: Boolean = await ContainerService.isContainerExist(
      containerId
    );
    if (!isCanExist) {
      throw new BussinessError("Container is not exists.");
    }
  } else {
    const isDocExist: Boolean = await DocService.isDocExist(docId);
    if (!isDocExist) {
      throw new BussinessError("Doc is not exists.");
    }
  }
  next();
}
