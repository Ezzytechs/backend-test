import request from "supertest";
import app from "../src/server";
import db from "../src/db";

  let testUserId: number;
  let testAddressId: number;

describe("Address API", () => {


  beforeAll(async () => {
   //Ensure the database is clean before running tests
    await db("addresses").del();
    await db("users").del();

    //Insert a test user
    const [userId] = await db("users").insert({
      username: "Test123",
      firstName: "Test Me",
      lastName: "Test Me",
      email: "james@example.com",
    });

    testUserId = userId;
  });

  afterAll(async () => {
    // Cleanup: Close database connection after all tests
    await db.destroy();
  });

  // Create Address 
  describe("Create Address", () => {
    it("should create a new address for a valid user", async () => {
      const newAddress = { user_id: testUserId, street: "123 Main St", city: "New York", state:"Kwara" };
      const res = await request(app).post(`/api/addresses/${testUserId}`).send(newAddress);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("user_id", newAddress.user_id);
      expect(res.body).toHaveProperty("street", newAddress.street);
      expect(res.body).toHaveProperty("city", newAddress.city);

      testAddressId = res.body.id;
    });

    it("should return 404 if user does not exist", async () => {
      const res = await request(app).post(`/api/addresses/9999`).send({
        user_id: 99999, street: "456 Elm St", city: "Los Angeles", state:"NYC"
      });


      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error", "User not found");
    });

    it("should return 400 if user already has an address", async () => {
      const res = await request(app).post(`/api/addresses/${testUserId}`).send({
        user_id: testUserId, street: "789 Oak St", city: "Chicago", state:"Kwara"
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error", "User already has an address");
    });
  });
 
  // //Get Address By User ID
  describe("Get Address by User ID", () => {

    it("should return the address for a valid user ID", async () => {
      const res = await request(app).get(`/api/addresses/${testUserId}`);

      expect(res.status).toBe(200);
     expect(res.body).toHaveProperty("id", testAddressId);
      expect(res.body).toHaveProperty("user_id", testUserId);
      expect(res.body).toHaveProperty("street", "123 Main St");
      expect(res.body).toHaveProperty("city", "New York");
    });
   
    it("should return 404 if the user does not exist", async () => {
      const res = await request(app).get("/api/addresses/99999");

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error", "User not found");
    });

    it("should return 404 if the user exists but has no address", async () => {
     const [newUserId] = await db("users").insert({  username: "Test123",
      firstName: "my name",
      lastName: "my test",
      email: "jexample.com",});


      const res = await request(app).get(`/api/addresses/${newUserId}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error", "Address not found for this user");
    });

    it("should return 400 for an invalid user ID format", async () => {
      const res = await request(app).get("/api/addresses/invalid-id");

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error", "Invalid user ID format");
    });
   });

   //Update Address 
  describe("Update Address", () => {

    it("should update the address for an existing user", async () => {
      const updatedAddress = { street: "456 New St", city: "Newtown", state:"Kwara" };

      const res = await request(app).patch(`/api/addresses/${testUserId}`).send(updatedAddress);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message", "Address updated successfully");

      // Verify update in database
      const dbAddress = await db("addresses").where({ user_id: testUserId }).first();
      expect(dbAddress.street).toBe(updatedAddress.street);
      expect(dbAddress.city).toBe(updatedAddress.city);
    });

    it("should return 404 if the user does not exist", async () => {
      const res = await request(app).patch("/api/addresses/99999").send({
        street: "789 Unknown St", city: "Unknownville", state:"Kwara"
      });
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error", "User not found");
    });

    it("should return 404 if the user has no address", async () => {
      const [newUserId] = await db("users").insert({ username: "No Address User", email: "jamnewaddress@example.com", 
        firstName:"test", lastName:"Man"
      });

      const res = await request(app).patch(`/api/addresses/${newUserId}`).send({
        street: "999 Empty St", city: "Nowhere", state:"No where"
      });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error", "Address not found for this user");
    });
  });
});