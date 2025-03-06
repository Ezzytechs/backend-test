import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("address", (table) => {
      table.increments("id").primary();
      table.string("street").notNullable();
      table.string("city").notNullable();
      table.integer("user_id").unsigned().references("id").inTable("users").onDelete("CASCADE");
    });
  }
  

  
  
  export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("address");
  }
  