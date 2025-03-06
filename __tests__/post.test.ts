import request from "supertest";
import app from "../src/server";
import db from "../src/db";

let testUserId: number;
let testPostId: number;

describe("Posts API", () => {

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

  // Create Post
  describe("Create Post", () => {
    it("should create a new post successfully", async () => {
      const newPost = { user_id: testUserId, title: "Test Post", body: "This is a test post" };

      const res = await request(app).post(`/api/posts/${testUserId}`).send(newPost);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("user_id", newPost.user_id);
      expect(res.body).toHaveProperty("title", newPost.title);
      expect(res.body).toHaveProperty("body", newPost.body);

      testPostId = res.body.id;
    });
  });

  // Get User Posts 
  describe("Get User Posts", () => {
    it("should return posts for a valid user", async () => {
      const res = await request(app).get(`/api/posts/${testUserId}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty("id", testPostId);
      expect(res.body[0]).toHaveProperty("user_id", testUserId);
    });

    it("should return 404 if no posts are found", async () => {
      const [newUserId] = await db("users").insert({ username: "No Posts User", email: "noposts@example.com", firstName:"James", lastName:"Ezzy" });

      const res = await request(app).get(`/api/posts/${newUserId}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "No posts found for this user");
    });
  });

  //Delete Post
  describe("Delete Post", () => {
    it("should delete a post successfully", async () => {
      const res = await request(app).delete(`/api/posts/${testPostId}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message", "Post deleted successfully");

      // Verify deletion in database
      const deletedPost = await db("posts").where({ id: testPostId }).first();
      expect(deletedPost).toBeUndefined();
    });

    it("should return 404 if the post does not exist", async () => {
      const res = await request(app).delete("/api/posts/99999");

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error", "Post not found");
    });
  });
});
