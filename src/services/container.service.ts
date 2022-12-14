import Container, { IContainer, TContainer } from "../models/Container";
import { Query } from "mongoose";
import { TField } from "../models/Field";
import Doc, { IDoc } from "../models/Doc";
import OperationService from "./operation.service";

export default class ContainerService {
  static async isContainerExist(containerId: string): Promise<Boolean> {
    const num = await Container.count({ _id: containerId });
    return num > 0;
  }

  static async getContainerById(containerId: string): Promise<IContainer> {
    const container: IContainer = await Container.findOne({
      _id: containerId,
    })
      .populate("owner", ["avatar", "email"])
      .populate("viewPermissions", ["avatar", "email"])
      .populate("updatePermissions", ["avatar", "email"]);

    return container;
  }

  static async getContainersByUserId(
    userId: string,
    page: number,
    pageSize: number
  ): Promise<Query<IContainer[], IContainer, {}>> {
    const container = await Container.find(
      {
        $or: [
          {
            owner: { _id: userId },
          },
          {
            viewPermissions: { $eq: userId },
          },
          {
            updatePermissions: { $eq: userId },
          },
        ],
      },
      {},
      { limit: pageSize, offset: page }
    );

    return container;
  }

  static async saveContainer(container: TContainer): Promise<IContainer> {
    let containerSave: IContainer = new Container(container);
    await containerSave.save();
    return containerSave;
  }

  static async addFieldToContainer(containerId: string, field: TField) {
    const container: IContainer = await Container.findOne({
      _id: containerId,
    });
    container.fields.push(field);
    await container.save();
  }

  static async addContainerToDoc(docId: string, container: TContainer) {
    const doc: IDoc = await Doc.findOne({
      _id: docId,
    });
    doc.containers.push(container);
    await doc.save();
    OperationService.saveOperation(container.owner, "SAVE_CONTAINER_TO_DOC", {
      container,
      doc,
    });
  }
}
