const request = require("supertest");
const app = require("./server");

describe("FridgeMart backend", () => {
  test("GET / returns the backend health message", async () => {
    const res = await request(app).get("/");

    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("FridgeMart Backend Running");
  });

  test("GET /test returns JSON health response", async () => {
    const res = await request(app).get("/test");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ msg: "You are on test route" });
  });
});
