import { Document, model, Schema } from "mongoose";
import { IUser } from "./user.model";

/**
 * @param name:string
 */
export type TOperation = {
  date: {
    type: Date;
  };
  operated: string;
  object: Object;
  who: IUser["_id"];
};

/**
 * @param user:ref => User._id
 * @param name:string
 */
export interface IOperation extends TOperation, Document {}

const operationSchema: Schema = new Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  who: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  operated: {
    type: String,
  },
  object: {
    type: Object,
  },
});

/**
 * @param name:string
 */
const Operation = model<IOperation>("Operation", operationSchema);

export default Operation;
