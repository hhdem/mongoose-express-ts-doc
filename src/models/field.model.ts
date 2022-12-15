import { Document, model, Schema, Types } from "mongoose";
import { IUser } from "./user.model";

/**
 * @param name:string
 */
export type TField = {
  name: string;
  value: string;
  viewPermissions: [IUser["_id"]];
  updatePermissions: [IUser["_id"]];
  owner: IUser["_id"];
};

/**
 * @param user:ref => User._id
 * @param name:string
 */
export interface IField extends TField, Document {}

const fieldSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  value: {
    type: String,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  viewPermissions: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  updatePermissions: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

/**
 * @param name:string
 */
const Field = model<IField>("Field", fieldSchema);

export default Field;
