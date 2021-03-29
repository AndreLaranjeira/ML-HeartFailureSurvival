// Migration to alter on delete action for user's role FK to RESTRICT.
exports.up = function(knex) {
  return knex.schema.alterTable("USERS", function(table) {
    // Drop existing foreign key.
    table.dropForeign("ROLE_ID");

    // Recreate foreign key with RESTRICT on delete action.
    table.foreign("ROLE_ID")
      .references("ID")
      .on("ROLES")
      .onDelete("RESTRICT");
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable("USERS", function(table) {
    // Drop existing foreign key.
    table.dropForeign("ROLE_ID");

    // Recreate foreign key with NO ACTION on delete action.
    table.foreign("ROLE_ID")
      .references("ID")
      .on("ROLES")
      .onDelete("NO ACTION");
  });
};
