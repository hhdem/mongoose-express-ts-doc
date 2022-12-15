import request from "supertest";
import app from "../../app";
import DocService from "../../services/doc.service";
import jwt from "jsonwebtoken";
import FieldService from "../../services/field.service";
import UserService from "../../services/user.service";
import ContainerService from "../../services/container.service";

describe("Field Controller", () => {
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

  test("should get a field model", async () => {
    jest
      .spyOn(FieldService, "getFieldById")
      .mockReturnValueOnce({ _id: "xx" } as any);

    return request(app)
      .get("/api/field/xx")
      .set({ "x-auth-token": "xxxx" })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            _id: expect.any(String),
          })
        );
      });
  });

  test("should throw an error message when field is not exist", async () => {
    jest.spyOn(FieldService, "getFieldById").mockReturnValueOnce(null as any);

    return request(app)
      .get("/api/field/xx")
      .set({ "x-auth-token": "xxxx" })
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            message: expect.any(String),
          })
        );
      });
  });

  test("should save a field model and save it to doc model", async () => {
    jest
      .spyOn(UserService, "getUserById")
      .mockReturnValueOnce({ _id: "userId" } as any);
    jest.spyOn(FieldService, "saveField").mockReturnValueOnce({
      _id: "fieldid",
      name: "field name",
      docId: "6399f41f727085d7858fd5e2",
    } as any);

    jest.spyOn(DocService, "addFieldToDoc").mockReturnValueOnce({
      _id: "fieldid",
      name: "field name",
      docId: "6399f41f727085d7858fd5e2",
    } as any);

    jest.spyOn(DocService, "isDocExist").mockReturnValueOnce(true as any);

    return request(app)
      .post("/api/field")
      .send({ name: "field name", docId: "6399f41f727085d7858fd5e2" })
      .set({ "x-auth-token": "xxxx" })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            _id: expect.any(String),
            name: expect.any(String),
            docId: expect.any(String),
          })
        );
      });
  });

  test("should save a field model and save it to container model", async () => {
    jest
      .spyOn(UserService, "getUserById")
      .mockReturnValueOnce({ _id: "userId" } as any);
    jest.spyOn(FieldService, "saveField").mockReturnValueOnce({
      _id: "fieldid",
      name: "field name",
      containerId: "6399f41f727085d7858fd5e2",
    } as any);

    jest.spyOn(ContainerService, "addFieldToContainer").mockReturnValueOnce({
      _id: "fieldid",
      name: "field name",
      containerId: "6399f41f727085d7858fd5e2",
    } as any);

    jest
      .spyOn(ContainerService, "isContainerExist")
      .mockReturnValueOnce(true as any);

    return request(app)
      .post("/api/field")
      .send({ name: "field name", containerId: "6399f41f727085d7858fd5e2" })
      .set({ "x-auth-token": "xxxx" })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            _id: expect.any(String),
            name: expect.any(String),
            containerId: expect.any(String),
          })
        );
      });
  });

  test("should delete field by id", async () => {
    jest.spyOn(FieldService, "isFieldExist").mockReturnValueOnce(true as any);
    jest
      .spyOn(FieldService, "checkUserPermissions")
      .mockReturnValueOnce(true as any);
    jest
      .spyOn(FieldService, "deleteFieldById")
      .mockReturnValueOnce(true as any);

    return request(app)
      .delete("/api/field/6398bd0ace62ebd535bf3f0b")
      .set({ "x-auth-token": "xxxx" })
      .expect(200)
      .then((response) => {
        expect(response.body).toBe(true);
      });
  });

  test("should not delete field with wrong id", async () => {
    jest.spyOn(FieldService, "isFieldExist").mockReturnValueOnce(false as any);

    return request(app)
      .delete("/api/field/6398bd0ace62ebd535bf3f0b")
      .set({ "x-auth-token": "xxxx" })
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            message: expect.any(String),
          })
        );
      });
  });

  test("should update field by id", async () => {
    jest.spyOn(FieldService, "isFieldExist").mockReturnValueOnce(true as any);
    jest
      .spyOn(FieldService, "checkUserPermissions")
      .mockReturnValueOnce(true as any);
    jest.spyOn(FieldService, "getFieldById").mockReturnValueOnce({
      name: "old field name",
      fieldId: "6398bd0ace62ebd535bf3f0b",
    } as any);

    jest.spyOn(FieldService, "updateField").mockReturnValueOnce({
      name: "update field name",
      fieldId: "6398bd0ace62ebd535bf3f0b",
    } as any);

    return request(app)
      .put("/api/field")
      .set({ "x-auth-token": "xxxx" })
      .send({
        name: "update field name",
        fieldId: "6398bd0ace62ebd535bf3f0b",
      })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
          fieldId: "6398bd0ace62ebd535bf3f0b",
          name: "update field name",
        });
      });
  });

  test("should not update field with wrong id", async () => {
    jest.spyOn(FieldService, "isFieldExist").mockReturnValueOnce(false as any);

    return request(app)
      .put("/api/field")
      .set({ "x-auth-token": "xxxx" })
      .send({
        name: "update field name",
        fieldId: "wrong id",
      })
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            message: expect.any(String),
          })
        );
      });
  });
});
