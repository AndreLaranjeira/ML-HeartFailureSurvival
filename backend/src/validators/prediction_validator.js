// Package imports.
const {celebrate, Joi, Segments} = require("celebrate");

// Export module.
module.exports = {
  create: celebrate({
    [Segments.BODY]: Joi.object().keys({
      age: Joi.number().integer().min(0).required(),
      creatinine_phosphokinase: Joi.number().positive().integer().required(),
      diabetes: Joi.boolean().required(),
      ejection_fraction: Joi.number().positive().integer().required(),
      platelets: Joi.number().positive().integer().required(),
      serum_creatinine: Joi.number().positive().precision(2).required(),
      sex: Joi.number().valid(0, 1).required(),
      anemia: Joi.boolean().required(),
      high_blood_pressure: Joi.boolean().required(),
      smoking: Joi.boolean().required()
    }),
    [Segments.PARAMS]: Joi.object().keys({
      patient_id: Joi.number().positive().integer().required()
    })
  }),

  delete: celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      patient_id: Joi.number().positive().integer().required(),
      prediction_id: Joi.number().positive().integer().required()
    })
  }),

  index: celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      patient_id: Joi.number().positive().integer().required()
    }),
    [Segments.QUERY]: Joi.object().keys({
      page: Joi.number().positive().integer()
    })
  })
};
