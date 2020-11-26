// Package imports.
const knex = require("knex");

// File imports.
const configuration = require("../knexfile");

// Create connection.
const db_settings = process.env.NODE_ENV === "test" ? configuration.test :
  configuration.development;
const connection = knex(db_settings);

// Export module.
module.exports = connection;
