// Migration to create the users table.
exports.up = function(knex) {
  return knex.schema.createTable("USERS", function(table) {
    table.increments("ID").primary();

    // Regular fields.
    table.string("EMAIL").unique().notNullable();
    table.string("HASHED_PASSWORD").notNullable();
    table.string("FULL_NAME").notNullable();
    table.boolean("IS_ACTIVE").notNullable();

    // Foreign keys.
    table.integer("ROLE_ID").unsigned().notNullable();
    table.foreign("ROLE_ID").references("ID").on("ROLES");

    table.timestamps();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("USERS");
};
