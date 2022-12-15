import bcrypt from "bcryptjs";
import config from "config";
import { Response } from "express";
import { validationResult } from "express-validator";
import HttpStatusCodes from "http-status-codes";
import jwt from "jsonwebtoken";

import Payload from "../../types/Payload";
import Request from "../../types/Request";
import User, { IUser, TUser } from "../../models/user.model";
import UserService from "../../services/user.service";

export async function saveUser(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  let user: IUser = await UserService.getUserByEmail(email);

  if (user) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({
      errors: [
        {
          msg: "User already exists",
        },
      ],
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  // Build user object based on TUser
  const userFields: TUser = {
    email,
    password: hashed,
  };

  user = new User(userFields);
  await user.save();

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
