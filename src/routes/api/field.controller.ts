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
  const { name, id, value } = req.body;
  const field: IField = await FieldService.getFieldById(id);
  if (!field) {
    throw new BussinessError("There is no field for this user");
  }
  field.name = name;
  field.value = value;
  await FieldService.updateField(id, field);
  res.json(field);
}

export async function saveField(req: Request, res: Response) {
  const { name, docId, containerId, value } = req.body;

  let user: IUser = await UserService.getUserById(req.userId);
  const field: TField = {
    name: name,
    value: value,
    owner: user,
    viewPermissions: [user],
    updatePermissions: [user],
  };

  const fieldSaved = await FieldService.saveField(field);
  if (docId) {
    await DocService.addFieldToDoc(docId, fieldSaved);
  }
  if (containerId) {
    await ContainerService.addFieldToContainer(containerId, fieldSaved);
  }

  res.json(fieldSaved);
}
