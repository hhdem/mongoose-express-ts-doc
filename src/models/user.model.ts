import { Document, model, Schema } from "mongoose";

/**
 * Type to model the User Schema for TypeScript.
 * @param email:string
 * @param password:string
 */
export type TUser = {
  email: string;
  password: string;
};

/**
 * @param email:string
 * @param password:string
 */
export interface IUser extends TUser, Document {}

const userSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

/**
 * @param email:string
 * @param password:string
 */

const User = model<IUser>("User", userSchema);

export default User;
