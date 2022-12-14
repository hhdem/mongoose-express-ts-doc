import { Router, Response } from "express";
import HttpStatusCodes from "http-status-codes";

import auth from "../../middleware/auth.middleware";
import Request from "../../types/Request";
import { IField, TField } from "../../models/Field";
import { IUser } from "../../models/User";
import FieldService from "../../services/field.service";
import UserService from "../../services/user.service";
import DocService from "../../services/doc.service";
import { check } from "express-validator";
import ContainerService from "../../services/container.service";
import checkContainerOrDocBeforeSave from "../../middleware/checkContainerOrDocBeforeSave.middleware";
require("express-async-errors");
const router: Router = Router();

// @route   GET api/field/:id
// @desc    Get
// @access  Private
router.get("/:fieldId", async (req: Request, res: Response) => {
  const field: IField = await FieldService.getFieldById(req.params.fieldId);
  if (!field) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({
      errors: [
        {
          msg: "There is no field for this user",
        },
      ],
    });
  }

  res.json(field);
});

// @route   GET api/field
// @desc    Get
// @access  Private
router.get("/", auth, async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 0;
  const pageSize = Number(req.query.pageSize) || 10;
  const field = await FieldService.getFieldsByUserId(
    req.userId,
    page,
    pageSize
  );
  if (!field) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({
      errors: [
        {
          msg: "There is no field for this user",
        },
      ],
    });
  }

  res.json(field);
});

// @route   POST api/field
// @desc    POST to save a new field
// @access  Private
router.post(
  "/",
  [
    auth,
    check("name", "name is required").not().isEmpty(),
    checkContainerOrDocBeforeSave,
  ],
  async (req: Request, res: Response) => {
    const { name, docId, containerId } = req.body;

    let user: IUser = await UserService.getUserById(req.userId);
    const field: TField = {
      name: name,
      owner: user,
      viewPermissions: [user],
      updatePermissions: [user],
    };

    const fieldSaved = await FieldService.saveField(field);
    if (docId) {
      await DocService.addFieldToDoc(docId, fieldSaved);
    } else if (containerId) {
      await ContainerService.addFieldToContainer(containerId, fieldSaved);
    }

    res.json(fieldSaved);
  }
);

export default router;
