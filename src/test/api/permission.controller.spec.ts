import request from "supertest";
import app from "../../app";
import UserService from "../../services/user.service";
import jwt from "jsonwebtoken";
import FieldService from "../../services/field.service";
import ContainerService from "../../services/container.service";

// mock database , not need to connect when test controller
jest.mock("../../../config/database", () => {
  return jest.fn();
});

beforeEach(() => {
  const verify = jest.spyOn(jwt, "verify");
  verify.mockImplementation(() => () => ({ userId: "xx" }));
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("Permission Route", () => {
  test("should set field permissions for user", async () => {
    jest
      .spyOn(UserService, "getUserById")
      .mockReturnValueOnce({ _id: "user id" } as any);

    jest
      .spyOn(FieldService, "setUserPermissions")
      .mockReturnValueOnce(true as any);
    jest.spyOn(FieldService, "isFieldExist").mockReturnValueOnce(true as any);

    return request(app)
      .post("/api/permission")
      .send({ userId: "user id", fieldId: "field id", type: "view" })
      .set({ "x-auth-token": "xxxx" })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            message: "Set Permission Successfully.",
          })
        );
      });
  });

  test("should set container permissions for user", async () => {
    jest
      .spyOn(UserService, "getUserById")
      .mockReturnValueOnce({ _id: "user id" } as any);

    jest
      .spyOn(ContainerService, "isContainerExist")
      .mockReturnValueOnce(true as any);
    jest.spyOn(FieldService, "isFieldExist").mockReturnValueOnce(true as any);
    jest
      .spyOn(ContainerService, "setUserPermissions")
      .mockReturnValueOnce(true as any);

    return request(app)
      .post("/api/permission")
      .send({ userId: "user id", containerId: "container id", type: "view" })
      .set({ "x-auth-token": "xxxx" })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            message: "Set Permission Successfully.",
          })
        );
      });
  });
});
