// Package imports.
const {celebrate, Joi, Segments} = require("celebrate");

// Export module.
module.exports = {
  authenticate: celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required()
    })
  }),

  register: celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required(),
      full_name: Joi.string().required(),
      role_id: Joi.number().min(1).required()
    })
  }),

  validate: celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required()
    }).unknown()
  })
};
