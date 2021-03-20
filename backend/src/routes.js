// Package imports.
const express = require("express");

// Controller imports.
const AuthController = require("./controllers/auth_controller");
const PatientController = require("./controllers/patient_controller");

// Middleware imports.
const AuthMiddleware = require("./middlewares/auth_middleware");

// Validator imports.
const AuthValidator = require("./validators/auth_validator");
const PatientValidator = require("./validators/patient_validator");

// Router.
const routes = express.Router();

// Authentication routes.
routes.post("/auth/authenticate", AuthValidator.authenticate, AuthController.authenticate);
routes.post("/auth/register", AuthValidator.register, AuthController.register);
routes.post("/auth/validate", AuthValidator.validate, AuthController.validate);

// Patient routes.
routes.delete("/patients/:id", PatientValidator.delete, AuthMiddleware, PatientController.delete);
routes.get("/patients", PatientValidator.index, AuthMiddleware, PatientController.index);
routes.get("/patients/:id", PatientValidator.read, AuthMiddleware, PatientController.read);
routes.post("/patients", PatientValidator.create, AuthMiddleware, PatientController.create);
routes.put("/patients/:id", PatientValidator.update, AuthMiddleware, PatientController.update);

// Export module.
module.exports = routes;
