import { Router, Response } from "express";
import HttpStatusCodes from "http-status-codes";

import auth from "../../middleware/auth.middleware";
import Request from "../../types/Request";
import { IContainer, TContainer } from "../../models/Container";
import ContainerService from "../../services/container.service";
import UserService from "../../services/user.service";
import { IUser } from "../../models/User";
import DocService from "../../services/doc.service";
import { check } from "express-validator";
require("express-async-errors");
const router: Router = Router();

// @route   GET api/container/:id
// @desc    Get
// @access  Private
router.get("/:id", auth, async (req: Request, res: Response) => {
  const { id } = req.params;

  const container: IContainer = await ContainerService.getContainerById(id);
  if (!container) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({
      errors: [
        {
          msg: "There is no container for this user",
        },
      ],
    });
  }

  res.json(container);
});

// @route   GET api/container
// @desc    Get
// @access  Private
router.get("/", auth, async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 0;
  const pageSize = Number(req.query.pageSize) || 10;
  const container = await ContainerService.getContainersByUserId(
    req.userId,
    page,
    pageSize
  );
  if (!container) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({
      errors: [
        {
          msg: "There is no field for this user",
        },
      ],
    });
  }

  res.json(container);
});

// @route   POST api/container
// @desc    POST to save a new container to doc
// @access  Private
router.post(
  "/",
  [
    auth,
    check("name", "name is required").not().isEmpty(),
    check("docId", "docId is required").not().isEmpty(),
  ],
  async (req: Request, res: Response) => {
    const { name, docId } = req.body;

    // Build profile object based on TProfile

    let user: IUser = await UserService.getUserById(req.userId);
    const container: TContainer = {
      name: name,
      owner: user,
      viewPermissions: [user],
      updatePermissions: [user],
    };

    const containerSaved = await ContainerService.saveContainer(container);
    await DocService.addContainerToDoc(docId, containerSaved);

    res.json(containerSaved);
  }
);

export default router;
