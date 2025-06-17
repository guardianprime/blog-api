jest.setTimeout(20000);
require("./setup");
const request = require("supertest");
const app = require("../app");

describe("Auth Endpoints", () => {
  it("should sign up a new user", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      first_name: "Test",
      last_name: "User",
      email: "test@example.com",
      password: "password123",
    });
    console.log(res.body);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
  });

  it("should sign in an existing user", async () => {
    const res = await request(app).post("/api/auth/signin").send({
      email: "test@example.com",
      password: "password123",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
