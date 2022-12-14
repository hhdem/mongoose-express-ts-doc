import { Response, NextFunction } from "express";
import ContainerService from "../services/container.service";
import Request from "../types/Request";

export default async function checkContainerBeforeSave(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { containerId } = req.body;
  if (!containerId) {
    throw new Error("Parameter containerId is required.");
  } else {
    const isCanExist: Boolean = await ContainerService.isContainerExist(
      containerId
    );
    if (!isCanExist) {
      throw new Error("Container is not exists.");
    }
  }
  next();
}
