import User from "../../models/user.model";
import UserService from "../../services/user.service";

describe("User Service", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("should get user by email", async () => {
    jest.spyOn(User, "findOne").mockReturnValueOnce({ _id: "xxxxxxxx" } as any);
    const pushData = jest.fn(async () => {
      return UserService.getUserByEmail("aaa@g.com");
    });
    const result = await pushData();
    return expect(result).toEqual({ _id: "xxxxxxxx" });
  });

  test("should throw an error when doc is not exist", async () => {
    jest.spyOn(User, "findOne").mockReturnValueOnce(null as any);
    const pushData = jest.fn(async () => {
      return UserService.getUserByEmail("aaa@g.com");
    });
    const result = await pushData();
    return expect(result).toEqual(null);
  });

  test("should get user by id", async () => {
    jest.spyOn(User, "findOne").mockReturnValueOnce({ _id: "xxx" } as any);
    const pushData = jest.fn(async () => {
      return UserService.getUserById("xxx");
    });
    const result = await pushData();
    return expect(result).toEqual({ _id: "xxx" });
  });
});
