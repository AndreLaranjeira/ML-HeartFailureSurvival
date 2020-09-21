// Package imports:
const {celebrate, Joi, Segments} = require("celebrate");

// Export module:
module.exports = {
  register: celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required(),
      full_name: Joi.string().required(),
      role_id: Joi.number().min(1).required()
    })
  })
};
