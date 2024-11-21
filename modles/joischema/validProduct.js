const joi = require("joi");

const joiProductSchema = joi.object({
  image: joi.string().required(),
  name: joi.string().required(),
  type: joi.string().required(),
  price: joi.number().required(),
  brand: joi.string().required(),
  qty: joi.number().required(),
  description: joi.string().required(),
  rating: joi.number().min(0).max(5).optional(),
  reviews: joi.number().min(0),
});
