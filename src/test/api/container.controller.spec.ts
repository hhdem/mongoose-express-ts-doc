import User from "../../models/user.model";
import request from "supertest";
import app from "../../app";
import UserService from "../../services/user.service";
import ContainerService from "../../services/container.service";
import { NextFunction } from "express";
import Request from "../../types/Request";
import DocService from "../../services/doc.service";
import jwt from "jsonwebtoken";

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

// jest.mock("jsonwebtoken", () => ({
//   ...jest.requireActual("jsonwebtoken"), // import and retain the original functionalities
//   verify: jest.fn().mockReturnValue({ userId: "xx" }), // overwrite verify
// }));

describe("Container Controller", () => {
  test("should create container by id", async () => {
    // jest.mock("../../middleware/auth.middleware", () => {
    //   const mockFunc = () => {
    //     return (req: Request, res: Response, next: NextFunction) => {
    //       req.userId = "xx";
    //       next();
    //     };
    //   };
    //   mockFunc.unless = jest.fn();
    //   return mockFunc;
    // });

    jest.spyOn(User, "findOne").mockReturnValueOnce({ _id: "xx" } as any);
    jest
      .spyOn(ContainerService, "saveContainer")
      .mockReturnValueOnce("xx" as any);

    jest
      .spyOn(DocService, "addContainerToDoc")
      .mockReturnValueOnce("xx" as any);

    return request(app)
      .post("/api/container")
      .set({ "x-auth-token": "xxxx" })
      .send({ name: "container name", docId: "6398bd0ace62ebd535bf3f0b" })
      .expect(200)
      .then((response) => {
        expect(response.body).toContain("xx");
      });
  });

  test("should get container by id", async () => {
    jest
      .spyOn(ContainerService, "getContainerById")
      .mockReturnValueOnce("containId" as any);
    return request(app)
      .get("/api/container/containId")
      .set({ "x-auth-token": "xxxx" })
      .expect(200)
      .then((response) => {
        expect(response.body).toContain("containId");
      });
  });

  test("should not get container by fake container id", async () => {
    jest
      .spyOn(ContainerService, "getContainerById")
      .mockReturnValueOnce(false as any);

    return request(app)
      .get("/api/container/containId")
      .set({ "x-auth-token": "xxxx" })
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({
          message: "There is no container for this user",
        });
      });
  });

  test("should delete container by id", async () => {
    jest
      .spyOn(ContainerService, "isContainerExist")
      .mockReturnValueOnce(true as any);

    jest
      .spyOn(ContainerService, "checkUserPermissions")
      .mockReturnValueOnce(true as any);

    jest
      .spyOn(ContainerService, "deleteContainerById")
      .mockReturnValueOnce("6398bd0ace62ebd535bf3f0b" as any);

    return request(app)
      .delete("/api/container/6398bd0ace62ebd535bf3f0b")
      .set({ "x-auth-token": "xxxx" })
      .expect(200)
      .then((response) => {
        expect(response.body).toContain("6398bd0ace62ebd535bf3f0b");
      });
  });

  test("should update container by id", async () => {
    jest
      .spyOn(ContainerService, "isContainerExist")
      .mockReturnValueOnce(true as any);

    jest
      .spyOn(ContainerService, "checkUserPermissions")
      .mockReturnValueOnce(true as any);

    jest.spyOn(ContainerService, "getContainerById").mockReturnValueOnce({
      name: "old container name",
      containerId: "6398bd0ace62ebd535bf3f0b",
    } as any);

    jest.spyOn(ContainerService, "updateContainer").mockReturnValueOnce({
      name: "update container name",
      containerId: "6398bd0ace62ebd535bf3f0b",
    } as any);

    return request(app)
      .put("/api/container")
      .set({ "x-auth-token": "xxxx" })
      .send({
        name: "update container name",
        containerId: "6398bd0ace62ebd535bf3f0b",
      })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
          containerId: "6398bd0ace62ebd535bf3f0b",
          name: "update container name",
        });
      });
  });

  test("should not update container when container does not exist", async () => {
    jest
      .spyOn(ContainerService, "isContainerExist")
      .mockReturnValueOnce(false as any);

    jest
      .spyOn(ContainerService, "getContainerById")
      .mockReturnValueOnce(null as any);

    return request(app)
      .put("/api/container")
      .set({ "x-auth-token": "xxxx" })
      .send({
        name: "update container name",
        containerId: "6398bd0ace62ebd535bf3f0b",
      })
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({ message: "Container is not exists." });
      });
  });
});
