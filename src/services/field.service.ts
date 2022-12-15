import Field, { IField, TField } from "../models/field.model";
import mongoose, { Query, Types } from "mongoose";
import OperationService from "./operation.service";
import { IUser } from "../models/user.model";
import Doc from "../models/doc.model";
import Container from "../models/container.model";

export default class FieldService {
  static async isFieldExist(fieldId: string): Promise<Boolean> {
    const fieldnum = await Field.count({ _id: fieldId });
    return fieldnum > 0;
  }
  static async getFieldById(fieldId: string): Promise<IField> {
    const field: IField = await Field.findOne({
      _id: fieldId,
    })
      .populate("owner", ["avatar", "email"])
      .populate("viewPermissions", ["avatar", "email"])
      .populate("updatePermissions", ["avatar", "email"]);

    return field;
  }

  static async getFieldsByUserId(
    userId: string,
    page: number,
    pageSize: number
  ): Promise<Query<IField[], IField, {}>> {
    const field = await Field.find(
      {
        $or: [
          {
            owner: { _id: userId },
          },
          {
            viewPermissions: { $eq: userId },
          },
          {
            updatePermissions: { $eq: userId },
          },
        ],
      },
      {},
      { limit: pageSize, offset: page }
    );

    return field;
  }

  static async deleteFieldById(_id: string) {
    return await Field.findByIdAndDelete(_id);
  }

  static async setUserPermissions(user: IUser, fieldId: string, type: string) {
    const field: IField = await Field.findOne({
      _id: fieldId,
    });
    if (type === "update") {
      field.updatePermissions.push(user);
    } else {
      field.viewPermissions.push(user);
    }
    await field.save();
  }

  static async checkUserPermissions(
    userId: string,
    fieldId: string,
    type: string
  ): Promise<Boolean> {
    const field: IField = await Field.findOne({
      _id: fieldId,
    })
      .populate("updatePermissions")
      .populate("viewPermissions");
    if (field.owner == userId) {
      return true;
    }
    let hasUser = field.updatePermissions.find((user) => user._id == userId);
    if (!hasUser && type === "view") {
      hasUser = field.viewPermissions.find((user) => user._id == userId);
    }
    return hasUser != null;
  }

  static async saveField(field: TField): Promise<IField> {
    let fieldSave: IField = new Field(field);
    await fieldSave.save();
    OperationService.saveOperationWithWhoId(field.owner, "SAVE_FIELD", field);
    return fieldSave;
  }

  static async updateField(_id: string, field: TField): Promise<IField> {
    const fieldSave = await Field.findOneAndUpdate({ _id }, field);
    OperationService.saveOperationWithWhoId(field.owner, "UPDATE_FIELD", field);
    return fieldSave;
  }
}
