// Migration to create the roles table.
exports.up = function(knex) {
  return knex.schema.createTable("ROLES", function(table) {
    table.increments("ID").primary();

    table.string("DESCRIPTION").notNullable();
    
    table.timestamps();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("ROLES");
};
