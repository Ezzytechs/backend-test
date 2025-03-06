import knex from "knex";
import config from "../knexfile2";

const environment = process.env.NODE_ENV || "development";

// Fix TypeScript issue by explicitly typing config lookup
const db = knex(config[environment as keyof typeof config]);

export default db;
