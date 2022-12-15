import FieldService from "../../services/field.service";
import Field from "../../models/field.model";
import Doc from "../../models/doc.model";
import Container from "../../models/container.model";

describe("Field Service", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("should check is field exist", async () => {
    jest.spyOn(Field, "count").mockReturnValueOnce(1 as any);
    const pushData = jest.fn(async () => {
      return FieldService.isFieldExist("fieldId");
    });
    const result = await pushData();
    return expect(result).toBe(true);
  });

  test("should delete field by id", async () => {
    jest.spyOn(Field, "findByIdAndDelete").mockReturnValueOnce({} as any);
    jest.spyOn(Doc, "updateMany").mockReturnValueOnce(null as any);
    jest.spyOn(Container, "updateMany").mockReturnValueOnce(null as any);

    const pushData = jest.fn(async () => {
      return FieldService.deleteFieldById("fieldId");
    });
    const result = await pushData();
    return expect(result).toEqual({});
  });

  test("should get fields by user id", async () => {
    jest.spyOn(Field, "find").mockReturnValueOnce({} as any);
    const pushData = jest.fn(async () => {
      return FieldService.getFieldsByUserId("fieldId", 0, 1);
    });
    const result = await pushData();
    return expect(result).toEqual({});
  });
});
