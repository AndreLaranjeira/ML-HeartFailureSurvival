// Package imports.
const {celebrate, Joi, Segments} = require("celebrate");

// Module imports.
const Patterns = require("../utils/validation_patterns");

// Export module.
module.exports = {
  authenticate: celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().required().pattern(Patterns.email).messages({
        "string.pattern.base": "\"email\" must be an email address"
      }),
      password: Joi.string().required().min(8)
    })
  }),

  register: celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().required().pattern(Patterns.email).messages({
        "string.pattern.base": "\"email\" must be an email address"
      }),
      full_name: Joi.string().required(),
      password: Joi.string().required().min(8),
      confirm_password: Joi.any()
        .valid(Joi.ref("password"))
        .required()
        .messages({
          "any.only": "\"confirm_password\" must match password"
        }),
      role_id: Joi.number().positive().integer().required()
    })
  }),

  validate: celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required()
    }).unknown()
  })
};
