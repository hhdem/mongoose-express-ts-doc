import { Response, NextFunction } from "express";
import requestUtils from "../utils/requestUtils";
import FieldService from "../services/field.service";
import Request from "../types/Request";
import BussinessError from "../utils/BussinessError";

export default async function checkFieldPermission(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const fieldId = req.body.fieldId || req.body.id || req.params.id;
  if (!fieldId) {
    throw new BussinessError("Parameter field id is required.");
  } else {
    // make sure the field exists
    const isFieldExist: Boolean = await FieldService.isFieldExist(fieldId);
    if (!isFieldExist) {
      throw new BussinessError("Field is not exists.");
    }
    const type = await requestUtils.getOperateType(req);
    // Check permissions
    const isOk: Boolean = await FieldService.checkUserPermissions(
      req.userId,
      fieldId,
      type
    );
    if (!isOk) {
      throw new BussinessError(
        "You don't have permission to " + type + " this field"
      );
    }
  }
  next();
}
