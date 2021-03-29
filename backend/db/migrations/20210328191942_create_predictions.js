// Migration to create the predictions table.
exports.up = function(knex) {
  return knex.schema.createTable("PREDICTIONS", function(table) {
    table.increments("ID").primary();

    // Regular fields.
    table.integer("AGE").notNullable();
    table.boolean("ANEMIA").notNullable();
    table.integer("CREATININE_PHOSPHOKINASE").notNullable();
    table.boolean("DIABETES").notNullable();
    table.integer("EJECTION_FRACTION").notNullable();
    table.boolean("HIGH_BLOOD_PRESSURE").notNullable();
    table.integer("PLATELETS").notNullable();
    table.float("SERUM_CREATININE").notNullable();
    table.integer("SERUM_SODIUM").notNullable();
    table.boolean("SEX").notNullable();
    table.boolean("SMOKING").notNullable();
    table.integer("TIME").notNullable();
    table.boolean("DEATH_PREDICTION");
    table.enu("PREDICTION_PROCESSING_STATUS", ["WAITING", "COMPLETED", "ERROR"])
      .notNullable()
      .defaultTo("WAITING");

    // Foreign keys.
    table.integer("PATIENT_ID").unsigned().notNullable();
    table.foreign("PATIENT_ID").references("ID").on("PATIENTS");

    table.timestamps();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("PREDICTIONS");
};
