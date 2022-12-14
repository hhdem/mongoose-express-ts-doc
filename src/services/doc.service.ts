import { TField } from "../models/Field";
import Doc, { IDoc, TDoc } from "../models/Doc";
import { TContainer } from "../models/Container";
import OperationService from "./operation.service";

export default class DocService {
  static async isDocExist(docId: string): Promise<Boolean> {
    const doc = await Doc.count({ _id: docId });
    return doc > 0;
  }

  static async getDocFieldAndContainerByDocIdAndUserId(
    docId: string,
    userId: string
  ): Promise<IDoc> {
    const doc: IDoc = await Doc.findOne({
      _id: docId,
    })
      .populate({
        path: "fields",
        match: {
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
      })
      .populate({
        path: "containers",
        match: {
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
      });
    return doc;
  }

  static async addFieldToDoc(docId: string, field: TField) {
    const doc: IDoc = await Doc.findOne({
      _id: docId,
    });
    doc.fields.push(field);
    await doc.save();
    OperationService.saveOperationWithWhoId(field.owner, "SAVE_FIELD_TO_DOC", {
      field,
      doc,
    });
  }

  static async addContainerToDoc(docId: string, container: TContainer) {
    const doc: IDoc = await Doc.findOne({
      _id: docId,
    });
    doc.containers.push(container);
    await doc.save();

    OperationService.saveOperationWithWhoId(
      container.owner,
      "SAVE_CONTAINER_TO_DOC",
      { container, doc }
    );
  }

  static async save(doc: TDoc) {
    let docSaved: IDoc = new Doc(doc);
    await docSaved.save();
    return docSaved;
  }
}
