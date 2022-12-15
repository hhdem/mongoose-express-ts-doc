import DocService from "../../services/doc.service";
import Doc from "../../models/doc.model";
import User from "../../models/user.model";
import UserService from "../../services/user.service";

describe("Doc Service", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("should doc is exist by id", async () => {
    jest.spyOn(Doc, "count").mockReturnValueOnce(1 as any);
    const pushData = jest.fn(async () => {
      return DocService.isDocExist("doc Id");
    });
    const result = await pushData();
    return expect(result).toEqual(true);
  });
});
