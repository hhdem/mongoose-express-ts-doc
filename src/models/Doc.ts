import { Document, model, Schema } from "mongoose";
import { IField } from "./Field";
import { IContainer } from "./Container";

/**
 * @param name:string
 */
export type TDoc = {
  name: string;
  fields?: [IField["_id"]];
  containers?: [IContainer["_id"]];
};

/**
 * @param user:ref => User._id
 * @param name:string
 */
export interface IDoc extends TDoc, Document {}

const docSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  fields: [
    {
      type: Schema.Types.ObjectId,
      ref: "Field",
    },
  ],
  containers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Container",
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
const Doc = model<IDoc>("Doc", docSchema);

export default Doc;
