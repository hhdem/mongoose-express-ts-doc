import { Document, model, Schema } from "mongoose";
import { IField } from "./Field";
import { IUser } from "./User";

/**
 * @param name:string
 */
export type TContainer = {
  owner: IUser["_id"];
  name: string;
  fields?: [IField["_id"]];
  viewPermissions: [IUser["_id"]];
  updatePermissions: [IUser["_id"]];
};

/**
 * @param user:ref => User._id
 * @param name:string
 */
export interface IContainer extends TContainer, Document {}

const containerSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  fields: [
    {
      type: Schema.Types.ObjectId,
      ref: "Field",
    },
  ],
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
const Container = model<IContainer>("Container", containerSchema);

export default Container;
