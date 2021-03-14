// Package imports.
const express = require("express");

// Controller imports.
const AuthController = require("./controllers/auth_controller");

// Middleware imports.
// const AuthMiddleware = require("./middlewares/auth_middleware");

// Validator imports.
const AuthValidator = require("./validators/auth_validator");

// Router.
const routes = express.Router();

// Authentication routes.
routes.post("/auth/authenticate", AuthValidator.authenticate, AuthController.authenticate);
routes.post("/auth/register", AuthValidator.register, AuthController.register);
routes.post("/auth/validate", AuthValidator.validate, AuthController.validate);

// Export module.
module.exports = routes;
