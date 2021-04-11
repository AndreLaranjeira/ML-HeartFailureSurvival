// Package imports.
const {errors} = require("celebrate");
const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");

// Module imports.
const routes = require("./routes");

// Local variables.
dotenv.config();

// Package configurations.
const corsOptions = {
  exposedHeaders: [
    "X-Total-Count",
    "X-Total-Pages"
  ]
};

// Application configuration.
const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(routes);
app.use(errors());

// Export module.
module.exports = app;
