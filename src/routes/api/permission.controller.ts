import { Response } from "express";
import { validationResult } from "express-validator";
import HttpStatusCodes from "http-status-codes";
import Request from "../../types/Request";
import UserService from "../../services/user.service";
import FieldService from "../../services/field.service";
import ContainerService from "../../services/container.service";

export async function savePermission(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ errors: errors.array() });
  }

  const { userId, fieldId, containerId, type } = req.body;

  // Get user model
  const user = await UserService.getUserById(userId);
  // Set permission to field model
  if (fieldId) {
    await FieldService.setUserPermissions(user, fieldId, type);
  }

  // Set permission to container model
  if (containerId) {
    await ContainerService.setUserPermissions(user, containerId, type);
  }

  res.json({ message: "Set Permission Successfully." });
}
