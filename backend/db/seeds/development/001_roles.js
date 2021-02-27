// Seeds for the ROLES table.
exports.seed = function(knex) {
  return knex("ROLES").del()
    .then(function () {
      return knex("ROLES").insert([
        {
          ID: 1,
          DESCRIPTION: "Admin",
          CREATED_AT: new Date(),
          UPDATED_AT: new Date()
        },
        {
          ID: 2,
          DESCRIPTION: "Medical staff",
          CREATED_AT: new Date(),
          UPDATED_AT: new Date()
        }
      ]);
    });
};
