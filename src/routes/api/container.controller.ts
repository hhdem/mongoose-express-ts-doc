import { Response } from "express";
import HttpStatusCodes from "http-status-codes";
import Request from "../../types/Request";
import { IContainer, TContainer } from "../../models/container.model";
import ContainerService from "../../services/container.service";
import UserService from "../../services/user.service";
import { IUser } from "../../models/user.model";
import DocService from "../../services/doc.service";
import BussinessError from "../../utils/BussinessError";

export async function deleteContainerById(req: Request, res: Response) {
  const { id } = req.params;

  const container: IContainer = await ContainerService.deleteContainerById(id);
  if (!container) {
    throw new BussinessError("There is no container for this user");
  }

  res.json(container);
}

export async function getContainerById(req: Request, res: Response) {
  const { id } = req.params;

  const container: IContainer = await ContainerService.getContainerById(id);
  if (!container) {
    throw new BussinessError("There is no container for this user");
  }

  res.json(container);
}

export async function updateContainer(req: Request, res: Response) {
  const { name, id } = req.body;
  const container: IContainer = await ContainerService.getContainerById(id);
  if (!container) {
    throw new BussinessError("There is no container for this user");
  }
  container.name = name;
  await ContainerService.updateContainer(id, container);
  res.json(container);
}

export async function saveContainer(req: Request, res: Response) {
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
