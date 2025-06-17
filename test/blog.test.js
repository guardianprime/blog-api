jest.setTimeout(20000);
require("./setup");
const request = require("supertest");
const app = require("../app");

let token;
let blogId;

beforeAll(async () => {
  // Sign up and get token
  const res = await request(app).post("/api/auth/signup").send({
    first_name: "Blog",
    last_name: "Tester",
    email: "blogtester@example.com",
    password: "password123",
  });
  token = res.body.token;
});

describe("Blog Endpoints", () => {
  it("should create a blog (draft)", async () => {
    const res = await request(app)
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Blog",
        description: "A test blog",
        tags: ["test", "blog"],
        body: "This is the body of the test blog.",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.state).toBe("draft");
    blogId = res.body._id;
  });

  it("should get published blogs (public)", async () => {
    const res = await request(app).get("/api/blogs");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should update blog state to published", async () => {
    const res = await request(app)
      .put(`/api/blogs/${blogId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ state: "published" });
    expect(res.statusCode).toBe(200);
    expect(res.body.state).toBe("published");
  });

  it("should get a single published blog (public)", async () => {
    const res = await request(app).get(`/api/blogs/${blogId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("title", "Test Blog");
  });

  it("should get my blogs", async () => {
    const res = await request(app)
      .get("/api/blogs/me/blogs")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should edit my blog", async () => {
    const res = await request(app)
      .put(`/api/blogs/${blogId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated Blog Title" });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Updated Blog Title");
  });

  it("should delete my blog", async () => {
    const res = await request(app)
      .delete(`/api/blogs/${blogId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Blog deleted");
  });
});
