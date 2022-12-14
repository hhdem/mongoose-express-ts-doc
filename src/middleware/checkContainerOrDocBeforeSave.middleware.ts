import { Response, NextFunction } from "express";
import DocService from "../services/doc.service";
import ContainerService from "../services/container.service";
import Request from "../types/Request";

export default async function checkContainerOrDocBeforeSave(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { containerId, docId } = req.body;
  if (!containerId && !docId) {
    throw new Error(
      "Parameter containerId or docId is required, we need at least one of them."
    );
  } else if (containerId) {
    const isCanExist: Boolean = await ContainerService.isContainerExist(
      containerId
    );
    if (!isCanExist) {
      throw new Error("Container is not exists.");
    }
  } else {
    const isDocExist: Boolean = await DocService.isDocExist(docId);
    if (!isDocExist) {
      throw new Error("Doc is not exists.");
    }
  }
  next();
}
