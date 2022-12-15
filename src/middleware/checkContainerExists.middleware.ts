import { Response, NextFunction } from "express";
import BussinessError from "../utils/BussinessError";
import ContainerService from "../services/container.service";
import Request from "../types/Request";

export default async function checkContainerExists(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { containerId } = req.body;
  if (!containerId) {
    throw new BussinessError("Parameter containerId is required.");
  } else {
    const isCanExist: Boolean = await ContainerService.isContainerExist(
      containerId
    );
    if (!isCanExist) {
      throw new BussinessError("Container is not exists.");
    }
  }
  next();
}
