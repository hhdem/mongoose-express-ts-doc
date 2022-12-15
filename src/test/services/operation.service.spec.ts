import jwt from "jsonwebtoken";
import Operation from "../../models/operation.model";
import OperationService from "../../services/operation.service";

describe("Operation Service", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("should save operation", async () => {
    jest
      .spyOn(Operation.prototype, "save")
      .mockReturnValueOnce({ _id: "xxxxxxxx" } as any);
    const pushData = jest.fn(async () => {
      return OperationService.saveOperation(null, "view", {});
    });
    const result = await pushData();
    return expect(result).toBeUndefined();
  });

  test("should save operation with userId", async () => {
    jest
      .spyOn(Operation.prototype, "save")
      .mockReturnValueOnce({ _id: "xxxxxxxx" } as any);
    const pushData = jest.fn(async () => {
      return OperationService.saveOperationWithWhoId(null, "view", {});
    });
    const result = await pushData();
    return expect(result).toBeUndefined();
  });
});
