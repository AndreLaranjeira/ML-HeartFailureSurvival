// Migration to alter on delete action for predictions's patient FK to CASCADE.
exports.up = function(knex) {
  return knex.schema.alterTable("PREDICTIONS", function(table) {
    // Drop existing foreign key.
    table.dropForeign("PATIENT_ID");

    // Recreate foreign key with CASCADE on delete action.
    table.foreign("PATIENT_ID")
      .references("ID")
      .on("PATIENTS")
      .onDelete("CASCADE");
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable("PREDICTIONS", function(table) {
    // Drop existing foreign key.
    table.dropForeign("PATIENT_ID");

    // Recreate foreign key with NO ACTION on delete action.
    table.foreign("PATIENT_ID")
      .references("ID")
      .on("PATIENTS")
      .onDelete("NO ACTION");
  });
};
