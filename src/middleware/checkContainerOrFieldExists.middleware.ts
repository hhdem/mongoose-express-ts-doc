import { Response, NextFunction } from "express";
import ContainerService from "../services/container.service";
import Request from "../types/Request";
import FieldService from "../services/field.service";
import BussinessError from "../utils/BussinessError";

export default async function checkContainerOrFieldExists(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { containerId, fieldId } = req.body;
  if (!containerId && !fieldId) {
    throw new BussinessError(
      "Parameter containerId or fieldId is required, we need at least one of them."
    );
  } else if (containerId) {
    const isCanExist: Boolean = await ContainerService.isContainerExist(
      containerId
    );
    if (!isCanExist) {
      throw new BussinessError("Container is not exists.");
    }
  } else {
    const isFieldIdExist: Boolean = await FieldService.isFieldExist(fieldId);
    if (!isFieldIdExist) {
      throw new BussinessError("Field is not exists.");
    }
  }
  next();
}
