import bcrypt from "bcryptjs";
import config from "config";
import { Response } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import Payload from "../../types/Payload";
import Request from "../../types/Request";
import User, { IUser } from "../../models/user.model";
import BussinessError from "../../utils/BussinessError";

export async function userLogin(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new BussinessError(errors.toString());
  }

  const { email, password } = req.body;

  let user: IUser = await User.findOne({ email });

  if (!user) {
    throw new BussinessError("Invalid Credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new BussinessError("Invalid Credentials");
  }

  const payload: Payload = {
    userId: user.id,
  };
  jwt.sign(
    payload,
    config.get("jwtSecret"),
    { expiresIn: config.get("jwtExpiration") },
    (err, token) => {
      if (err) throw err;
      res.json({ token });
    }
  );
}
