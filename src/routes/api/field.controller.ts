import { Response } from "express";
import HttpStatusCodes from "http-status-codes";

import Request from "../../types/Request";
import { IField, TField } from "../../models/field.model";
import { IUser } from "../../models/user.model";
import FieldService from "../../services/field.service";
import UserService from "../../services/user.service";
import DocService from "../../services/doc.service";
import ContainerService from "../../services/container.service";
import BussinessError from "../../utils/BussinessError";

export async function getFieldById(req: Request, res: Response) {
  const field: IField = await FieldService.getFieldById(req.params.id);
  if (!field) {
    throw new BussinessError("There is no field for this user");
  }
  res.json(field);
}

export async function deleteFieldById(req: Request, res: Response) {
  const { id } = req.params;

  const field: IField = await FieldService.deleteFieldById(id);
  if (!field) {
    throw new BussinessError("There is no field for this user");
  }

  res.json(field);
}

export async function updateField(req: Request, res: Response) {
  const { name, fieldId } = req.body;
  const field: IField = await FieldService.getFieldById(req.body.fieldId);
  if (!field) {
    throw new BussinessError("There is no field for this user");
  }
  field.name = name;
  await FieldService.updateField(fieldId, field);
  res.json(field);
}

export async function saveField(req: Request, res: Response) {
  const { name, docId, containerId } = req.body;

  let user: IUser = await UserService.getUserById(req.userId);
  const field: TField = {
    name: name,
    owner: user,
    viewPermissions: [user],
    updatePermissions: [user],
  };

  const fieldSaved = await FieldService.saveField(field);
  if (docId) {
    await DocService.addFieldToDoc(docId, fieldSaved);
  } else if (containerId) {
    await ContainerService.addFieldToContainer(containerId, fieldSaved);
  }

  res.json(fieldSaved);
}
