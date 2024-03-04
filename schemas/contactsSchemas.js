import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email().message({ "string.email": "Wrong email format" }),
  phone: Joi.string(),
})
  .min(1)
  .message({
    "object.min": "Body must have at least one field",
  });
