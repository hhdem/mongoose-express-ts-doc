import bcrypt from "bcryptjs";
import config from "config";
import { Router, Response } from "express";
import { check, validationResult } from "express-validator";
import gravatar from "gravatar";
import HttpStatusCodes from "http-status-codes";
import jwt from "jsonwebtoken";

import Payload from "../../types/Payload";
import Request from "../../types/Request";
import User, { IUser, TUser } from "../../models/User";
import UserService from "../../services/user.service";
require("express-async-errors");
const router: Router = Router();

// @route   POST api/user
// @desc    Register user given their email and password, returns the token upon successful registration
// @access  Public
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  saveUser
);

async function saveUser(req: Request, res: Response) {
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

  const options: gravatar.Options = {
    s: "200",
    r: "pg",
    d: "mm",
  };

  const avatar = gravatar.url(email, options);

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  // Build user object based on TUser
  const userFields: TUser = {
    email,
    password: hashed,
    avatar,
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

export default router;
