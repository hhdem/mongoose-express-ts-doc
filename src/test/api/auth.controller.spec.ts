describe("Auth Controller", () => {
  // mock database , not need to connect when test controller
  jest.mock("../../../config/database", () => {
    return jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("should login with right email and password", async () => {});

  test("should not login with wrong email and password", async () => {});
});
