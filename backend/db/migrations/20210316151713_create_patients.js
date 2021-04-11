// Migration to create the patients table.
exports.up = function(knex) {
  return knex.schema.createTable("PATIENTS", function(table) {
    table.increments("ID").primary();

    // Regular fields.
    table.string("FULL_NAME").notNullable();
    table.date("BIRTH_DATE").notNullable();
    table.enu("SEX", ["MALE", "FEMALE"]).notNullable();
    table.boolean("HAS_DIABETES").notNullable();

    // Foreign keys.
    table.integer("USER_ID").unsigned().notNullable();
    table.foreign("USER_ID").references("ID").on("USERS");

    table.timestamps();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("PATIENTS");
};
