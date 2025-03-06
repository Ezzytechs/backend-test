import request from "supertest";
import app from "../src/server";
import db from "../src/db";

let testUserId: number;
let server: any;

describe("User API", () => {
 
  beforeAll(async () => {
    // Ensure clean database state
    await db("posts").del();
    await db("users").del();

    // Insert a test user
    const [userId] = await db("users").insert({
      username: "User",
      email: "testuser@example.com",
      firstName:"Jamesson",
      lastName:"Ezzy"
    });

    testUserId = userId;
  });

  afterAll(async () => {
    // Cleanup: Close database connection after all tests
    await db.destroy();
  });
  beforeAll(async () => {
    // Ensure clean database state
    await db("posts").del();
    await db("users").del();

    // Insert a test user
    const [userId] = await db("users").insert({
      username: "User",
      email: "testuser@example.com",
      firstName:"Jamesson",
      lastName:"Ezzy"
    });

    testUserId = userId;
  });

  afterAll(async () => {
    // Cleanup: Close database connection after all tests
    await db.destroy();
  });

  it("should return a paginated list of users", async () => {
    const page = 1;
    const limit = 10;
    const res = await request(app).get(`/api/users?page=${page}&limit=${limit}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("page", page);
    expect(res.body).toHaveProperty("limit", limit);
    expect(res.body).toHaveProperty("totalUsers");
    expect(res.body).toHaveProperty("totalPages");
    expect(res.body).toHaveProperty("data");
    expect(typeof res.body.totalUsers).toBe("number");
    expect(typeof res.body.totalPages).toBe("number");
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should create a new user and return the user data", async () => {
    const newUser = {
      username: "James Ezzy",
      email: "james@gmail.com",
      firstName: "James",
      lastName: "Ezzy"
    };

    const res = await request(app).post("/api/users").send(newUser);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("username", newUser.username);
    expect(res.body).toHaveProperty("firstName", newUser.firstName);
    expect(res.body).toHaveProperty("lastName", newUser.lastName);
    expect(res.body).toHaveProperty("email", newUser.email);
  });

  it("should return a 400 error when request is invalid", async () => {
    const res = await request(app).post("/api/users").send({});
    expect(res.status).toBe(400);
  });

  it("should return the total number of users", async () => {
    const res = await request(app).get("/api/users/total/users");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("totalUsers");
    expect(typeof res.body.totalUsers).toBe("number");
    expect(res.body.totalUsers).toBeGreaterThanOrEqual(1);
  });

  it("should return a user by ID", async () => {
    const res = await request(app).get(`/api/users/${testUserId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", testUserId);
    expect(res.body).toHaveProperty("username", "User");
    expect(res.body).toHaveProperty("email", "testuser@example.com");
    expect(res.body).toHaveProperty("firstName", "Jamesson");
    expect(res.body).toHaveProperty("lastName", "Ezzy");
  });

  it("should return 404 if user is not found", async () => {
    const res = await request(app).get("/api/users/99999");
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error", "User not found");
  });

  it("should return 400 for invalid user ID format", async () => {
    const res = await request(app).get("/api/users/invalid-id");
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "Invalid user ID format");
  });
});