const joi = require("joi");

const joiUserSchema = joi.object({
  name: joi.string(),
  number: joi.number().min(10).required(),
  email: joi.string().email().required(),
  password: joi
    .string()
    .pattern(/^(?=.*\d)(?=.*[A-Z])[A-Za-z\d]{8,}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must have at least one capital letter, one number, and be at least 8 characters long.",
    }),
  confirmpassword: joi.string().valid(joi.ref("password")).required().messages({
    "any.only": "Confirm password must match password.",
  }),
});

const joiUserLogin = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

module.exports = { joiUserSchema, joiUserLogin };
