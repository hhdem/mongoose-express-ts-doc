import request from "supertest";
import app from "../../app";
import DocService from "../../services/doc.service";
import jwt from "jsonwebtoken";

describe("Doc Controller", () => {
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

  test("should get a doc model", async () => {
    jest
      .spyOn(DocService, "getDocFieldAndContainerByDocIdAndUserId")
      .mockReturnValueOnce({ _id: "xxxxxxxx" } as any);

    return request(app)
      .get("/api/doc/xxxxxxxx")
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

  test("should throw an error when doc is not exist", async () => {
    jest
      .spyOn(DocService, "getDocFieldAndContainerByDocIdAndUserId")
      .mockReturnValueOnce(null as any);

    return request(app)
      .get("/api/doc/xxxxxxxx")
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

  test("should save a doc model", async () => {
    jest
      .spyOn(DocService, "save")
      .mockReturnValueOnce({ _id: "xxxxxxxx" } as any);

    return request(app)
      .post("/api/doc")
      .set({ "x-auth-token": "xxxx" })
      .send({ name: "xxxxxx" })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            _id: expect.any(String),
          })
        );
      });
  });
});
