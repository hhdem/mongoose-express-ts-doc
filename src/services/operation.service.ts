import Operation, { IOperation } from "../models/Operation";
import { IUser } from "../models/User";

export default class OperationService {
  static async saveOperation(who: IUser, operated: string, object: Object) {
    const operation = {
      who,
      operated,
      object,
    };
    let operationSaved: IOperation = new Operation(operation);
    await operationSaved.save();
  }
  static async saveOperationWithWhoId(
    whoId: string,
    operated: string,
    object: Object
  ) {
    const operation = {
      whoId,
      operated,
      object,
    };
    let operationSaved: IOperation = new Operation(operation);
    await operationSaved.save();
  }
}
