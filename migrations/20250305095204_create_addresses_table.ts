import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('addresses', (table) => {
    table.increments('id').primary(); // Primary key
    table.string('street').notNullable(); // Street address
    table.string('city').notNullable(); // City
    table.string('state').notNullable(); // State
    table.integer('user_id').unsigned().notNullable(); // Foreign key to users table
    table.timestamps(true, true); // Adds `created_at` and `updated_at` columns

    // Foreign key constraint
    table
      .foreign('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE'); // If a user is deleted, their addresses are also deleted
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('addresses'); // Drop the table if rolling back
}

