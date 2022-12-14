import User from "../../models/User";
import request from "supertest";
import app from "../../app";
import UserService from "../../services/user.service";

afterEach(() => {
  jest.restoreAllMocks();
});

describe("GET /api/user", () => {
  test("should create user", async () => {
    jest
      .spyOn(User.prototype, "save")
      .mockReturnValueOnce({ token: "xxx" } as any);

    jest.spyOn(UserService, "getUserByEmail").mockReturnValueOnce(null as any);

    return request(app)
      .post("/api/user")
      .send({ email: "email11@g.com", password: "123123" })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            token: expect.any(String),
          })
        );
      });
  });

  test("should not create the same user", async () => {
    jest
      .spyOn(User.prototype, "save")
      .mockReturnValueOnce({ token: "xxx" } as any);

    jest.spyOn(UserService, "getUserByEmail").mockReturnValueOnce({
      email: "email11@g.com",
      password: "123123",
    } as any);

    return request(app)
      .post("/api/user")
      .send({ email: "email11@g.com", password: "123123" })
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: [{ msg: "User already exists" }],
          })
        );
      });
  });

  test("should not create user without email", async () => {
    jest.spyOn(UserService, "getUserByEmail").mockReturnValueOnce({
      password: "123123",
    } as any);

    return request(app)
      .post("/api/user")
      .send({ password: "123123" })
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: [
              {
                location: "body",
                msg: "Please include a valid email",
                param: "email",
              },
            ],
          })
        );
      });
  });
});
