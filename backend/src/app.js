// Package imports.
const {errors} = require("celebrate");
const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");

// Module imports.
const routes = require("./routes");

// Local variables.
dotenv.config();

// Application configuration.
const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);
app.use(errors());

// Export module.
module.exports = app;
