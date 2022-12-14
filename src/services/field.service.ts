import Field, { IField, TField } from "../models/Field";
import { Query } from "mongoose";
import OperationService from "./operation.service";

export default class FieldService {
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

  static async saveField(field: TField): Promise<IField> {
    let fieldSave: IField = new Field(field);
    await fieldSave.save();
    OperationService.saveOperationWithWhoId(field.owner, "SAVE_FIELD", field);
    return fieldSave;
  }
}
