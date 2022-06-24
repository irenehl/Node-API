const joi = require('joi');

const Validator = {
  registerValidator: (data) => {
    const validateSchema = joi.object({
      username: joi.string()
        .min(6)
        .required(),
      password: joi.string()
        .min(8)
        .required(),
    });

    return validateSchema.validateAsync(data);
  },

  loginValidator: (data) => {
    const validateSchema = joi.object({
      username: joi.string()
        .min(6)
        .required(),
      password: joi.string()
        .min(8)
        .required(),
    });

    return validateSchema.validateAsync(data);
  },

  updateValidator: (data) => {
    const validateSchema = joi.object({
      username: joi.string()
        .min(6),
      password: joi.string()
        .min(8),
    });

    return validateSchema.validateAsync(data);
  },
};

module.exports = Validator;
