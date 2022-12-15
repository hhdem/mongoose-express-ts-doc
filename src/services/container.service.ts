import Container, { IContainer, TContainer } from "../models/container.model";
import { Query } from "mongoose";
import { TField } from "../models/field.model";
import Doc, { IDoc } from "../models/doc.model";
import OperationService from "./operation.service";
import { IUser } from "../models/user.model";

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

  static async deleteContainerById(_id: string) {
    return await Container.findByIdAndDelete(_id);
  }

  static async addFieldToContainer(containerId: string, field: TField) {
    const container: IContainer = await Container.findOne({
      _id: containerId,
    });
    container.fields.push(field);
    await container.save();
  }

  static async setUserPermissions(
    user: IUser,
    containerId: string,
    type: string
  ) {
    const container: IContainer = await Container.findOne({
      _id: containerId,
    });
    if (type === "update") {
      container.updatePermissions.push(user);
    } else {
      container.viewPermissions.push(user);
    }
    await container.save();
  }

  static async checkUserPermissions(
    userId: string,
    containerId: string,
    type: string
  ) {
    const container: IContainer = await Container.findOne({
      _id: containerId,
    })
      .populate("updatePermissions")
      .populate("viewPermissions");
    if (container.owner == userId) {
      return true;
    }
    let hasUser = container.updatePermissions.find(
      (user) => user._id == userId
    );
    if (!hasUser && type === "view") {
      hasUser = container.viewPermissions.find((user) => user._id == userId);
    }
    return hasUser;
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

  static async updateContainer(
    _id: string,
    container: TContainer
  ): Promise<IContainer> {
    const containerSaved = await Container.findOneAndUpdate({ _id }, container);
    OperationService.saveOperationWithWhoId(
      container.owner,
      "UPDATE_CONTAINER",
      container
    );
    return containerSaved;
  }
}
