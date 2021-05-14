// Migration to remove unused prediction feature columns from the predictions
// table.
exports.up = function(knex) {
  return knex.schema.alterTable("PREDICTIONS", function(table) {
    // Drop unused feature columns.
    table.dropColumn("SERUM_SODIUM");
    table.dropColumn("TIME");
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable("PREDICTIONS", function(table) {
    // Recreate the dropped feature columns.
    table.integer("SERUM_SODIUM").notNullable();
    table.integer("TIME").notNullable();
  });
};
