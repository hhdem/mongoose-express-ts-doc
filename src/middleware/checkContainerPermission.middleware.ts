import { Response, NextFunction } from "express";
import requestUtils from "../utils/requestUtils";
import ContainerService from "../services/container.service";
import Request from "../types/Request";
import BussinessError from "../utils/BussinessError";

export default async function checkContainerPermission(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const containerId = req.body.containerId || req.body.id || req.params.id;
  if (!containerId) {
    throw new BussinessError("Parameter containerId is required.");
  } else {
    // make sure the container exists
    const isContainerExist: Boolean = await ContainerService.isContainerExist(
      containerId
    );
    if (!isContainerExist) {
      throw new BussinessError("Container is not exists.");
    }
    const type = await requestUtils.getOperateType(req);
    // Check permissions
    const isOk: Boolean = await ContainerService.checkUserPermissions(
      req.userId,
      containerId,
      type
    );
    if (!isOk) {
      throw new BussinessError(
        "You don't have permission to " + type + " this container"
      );
    }
  }
  next();
}
