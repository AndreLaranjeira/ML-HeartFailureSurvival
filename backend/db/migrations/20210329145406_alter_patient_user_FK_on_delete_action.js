// Migration to alter on delete action for patient's user FK to CASCADE.
exports.up = function(knex) {
  return knex.schema.alterTable("PATIENTS", function(table) {
    // Drop existing foreign key.
    table.dropForeign("USER_ID");

    // Recreate foreign key with CASCADE on delete action.
    table.foreign("USER_ID")
      .references("ID")
      .on("USERS")
      .onDelete("CASCADE");
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable("PATIENTS", function(table) {
    // Drop existing foreign key.
    table.dropForeign("USER_ID");

    // Recreate foreign key with NO ACTION on delete action.
    table.foreign("USER_ID")
      .references("ID")
      .on("USERS")
      .onDelete("NO ACTION");
  });
};
