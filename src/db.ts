import knex from "knex";
import config from "../knexfile";

const environment = process.env.NODE_ENV as keyof typeof config || "development";
console.log(`Using environment: ${environment}`); // Log the environment

const db = knex(config[environment]);

export default db;




// import knex from "knex";
// import config from "../knexfile";

// const environment = process.env.NODE_ENV as keyof typeof config || "development";

// const db = knex(config[environment]);

// export default db;

// import knex from "knex";
// import config from "../knexfile";

// const db = knex(config.development);

// export default db;
