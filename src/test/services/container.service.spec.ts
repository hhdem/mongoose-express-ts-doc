import Doc from "../../models/doc.model";
import Container from "../../models/container.model";
import ContainerService from "../../services/container.service";

describe("Container Service", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("should delete Container By Id", async () => {
    jest.spyOn(Container, "findByIdAndDelete").mockReturnValueOnce({} as any);
    jest.spyOn(Doc, "updateMany").mockReturnValueOnce({} as any);
    jest.spyOn(Doc, "find").mockReturnValueOnce({} as any);
    jest.spyOn(Doc.prototype, "save").mockReturnValueOnce({} as any);

    const pushData = jest.fn(async () => {
      return ContainerService.deleteContainerById("c id");
    });
    const result = await pushData();
    return expect(result).toEqual(true);
  });
});
