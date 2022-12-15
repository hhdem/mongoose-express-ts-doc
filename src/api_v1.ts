import express from "express";
import { userLogin } from "./routes/api/auth.controller";
import { saveUser } from "./routes/api/user.controller";
import {
  deleteFieldById,
  getFieldById,
  saveField,
  updateField,
} from "./routes/api/field.controller";
import {
  deleteContainerById,
  getContainerById,
  saveContainer,
  updateContainer,
} from "./routes/api/container.controller";
import { getDocById, saveDoc } from "./routes/api/doc.controller";
import { check } from "express-validator";
import checkContainerPermission from "./middleware/checkContainerPermission.middleware";
import auth from "./middleware/auth.middleware";
import checkFieldPermission from "./middleware/checkFieldPermission.middleware";
import { savePermission } from "./routes/api/permission.controller";
import checkContainerOrFieldExists from "./middleware/checkContainerOrFieldExists.middleware";
import checkContainerOrDocExists from "./middleware/checkContainerOrDocExists.middleware";
require("express-async-errors");
var router = express.Router();

/**
 * Auth Route
 */

/**
 * Login user and get token
 * @route POST api/auth
 * @group Auth - Operations about user
 * @param {string} email.body.required - email - eg: user@domain.com
 * @param {string} password.body.required - user's password.
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.post(
  "/api/auth",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  userLogin
);

/**
 * Container Route
 */

// @route   GET api/container/:id
// @desc    Get
// @access  Private
router.get("/api/container/:id", auth, getContainerById);

// @route   DELETE api/container/:id
// @desc    DELETE
// @access  Private
router.delete(
  "/api/container/:id",
  auth,
  checkContainerPermission,
  deleteContainerById
);

// @route   PUT api/container
// @desc    PUT Update the container
// @access  Private
router.put(
  "/api/container",
  [
    auth,
    check("name", "name is required").not().isEmpty(),
    checkContainerPermission,
  ],
  updateContainer
);

// @route   POST api/container
// @desc    POST to save a new container to doc
// @access  Private
router.post(
  "/api/container",
  [
    auth,
    check("name", "name is required").not().isEmpty(),
    check("docId", "docId is required").not().isEmpty(),
  ],
  saveContainer
);

/**
 * Doc Route
 */

// @route   GET api/doc/:id
// @desc    Get method to find a doc by id, and only show the fields and containers depending on the userId
// @access  Private
router.get("/api/doc/:id", auth, getDocById);

// @route   POST api/doc
// @desc    Post method to save a new doc
// @access  Private
router.post(
  "/api/doc",
  [auth, check("name", "name is required").not().isEmpty()],
  saveDoc
);

/**
 * Field Route
 */

// @route   GET api/field/:id
// @desc    Get
// @access  Private
router.get("/api/field/:id", auth, getFieldById);

// @route   GET api/field/:id
// @desc    Get
// @access  Private
router.delete("/api/field/:id", auth, checkFieldPermission, deleteFieldById);

// @route   PUT api/field
// @desc    PUT Update the field
// @access  Private
router.put(
  "/api/field",
  [
    auth,
    checkFieldPermission,
    check("name", "name is required").not().isEmpty(),
  ],
  updateField
);

// @route   POST api/field
// @desc    POST to save a new field
// @access  Private
// check if the doc or container is already exists.
router.post(
  "/api/field",
  [
    auth,
    check("name", "name is required").not().isEmpty(),
    checkContainerOrDocExists,
  ],
  saveField
);

/**
 * Permission Route
 */

// @route   POST api/permission
// @desc    POST to save a user to field or container permission
// @access  Private
router.post(
  "/api/permission",
  auth,
  [check("userId", "Please include a valid userId").isString()],
  checkContainerOrFieldExists,
  savePermission
);

/**
 * User Route
 */

// @route   POST api/user
// @desc    Register user given their email and password, returns the token upon successful registration
// @access  Public
router.post(
  "/api/user",
  [
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  saveUser
);

export default router;
