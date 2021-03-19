// Package imports.
const {celebrate, Joi, Segments} = require("celebrate");

// Export module.
module.exports = {
  create: celebrate({
    [Segments.BODY]: Joi.object().keys({
      full_name: Joi.string().required(),
      birth_date: Joi.date().min("1-1-1900").required(),
      sex: Joi.string().required().valid("MALE", "FEMALE"),
      has_diabetes: Joi.boolean().required(),
      patient_user_id: Joi.number().positive().integer().required()
    })
  }),

  delete: celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().positive().integer().required()
    })
  }),

  read: celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().positive().integer().required()
    })
  })
};
