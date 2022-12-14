import { Router, Response } from "express";
import { check } from "express-validator";
import HttpStatusCodes from "http-status-codes";

import auth from "../../middleware/auth.middleware";
import Request from "../../types/Request";
import { IDoc, TDoc } from "../../models/Doc";
import DocService from "../../services/doc.service";
require("express-async-errors");
const router: Router = Router();

// @route   GET api/doc/:id
// @desc    Get method to find a doc by id, and only show the fields and containers depending on the userId
// @access  Private
router.get("/:id", auth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const uid = req.userId;
    const doc: IDoc = await DocService.getDocFieldAndContainerByDocIdAndUserId(
      id,
      uid
    );

    if (!doc) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        errors: [
          {
            msg: "There is no doc for this doc id",
          },
        ],
      });
    }

    res.json(doc);
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

// @route   POST api/doc
// @desc    Post method to save a new doc
// @access  Private
router.post(
  "/",
  [auth, check("name", "name is required").not().isEmpty()],
  async (req: Request, res: Response) => {
    const { name } = req.body;
    const docs: TDoc = {
      name: name,
    };
    const doc = await DocService.save(docs);
    res.json(doc);
  }
);

export default router;
