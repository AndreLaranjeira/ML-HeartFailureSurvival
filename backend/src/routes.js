// Package imports.
const express = require("express");

// Controller imports.
const AuthController = require("./controllers/auth_controller");

// Validator imports.
const AuthValidator = require("./validators/auth_validator");

// Router.
const routes = express.Router();

// Authentication routes.
routes.post("/auth/register", AuthValidator.register, AuthController.register);

// Export module.
module.exports = routes;
