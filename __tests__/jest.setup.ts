import app from "../src/server"; // Ensure correct import
import db from "../src/db";

let server: any;

beforeAll(async () => {
  server = app.listen(3001); // ✅ Test server runs on port 3001
  await db.migrate.latest(); // Ensure database is migrated (if using Knex)
});

afterAll(async () => {
  await db.destroy(); // Close DB connection properly
  server.close(); // Shut down the test server
});
