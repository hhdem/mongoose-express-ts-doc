import { Response } from "express";
import HttpStatusCodes from "http-status-codes";
import Request from "../../types/Request";
import { IDoc, TDoc } from "../../models/doc.model";
import DocService from "../../services/doc.service";
import BussinessError from "../../utils/BussinessError";

export async function getDocById(req: Request, res: Response) {
  const { id } = req.params;
  const uid = req.userId;
  const doc: IDoc = await DocService.getDocFieldAndContainerByDocIdAndUserId(
    id,
    uid
  );
  if (!doc) {
    throw new BussinessError("There is no doc for this doc id");
  }
  res.json(doc);
}

export async function saveDoc(req: Request, res: Response) {
  const { name } = req.body;
  const docs: TDoc = {
    name: name,
  };
  const doc = await DocService.save(docs);
  res.json(doc);
}
