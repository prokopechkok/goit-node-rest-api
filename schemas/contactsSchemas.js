import Joi from "joi";

const phonePattern = /^[(]{1}[0-9]{3}[)]{1} [0-9]{3}[-]{1}[0-9]{4}$/;

export const createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email().message({ "string.email": "Wrong email format" }),
  phone: Joi.string().pattern(phonePattern).messages({
    "string.pattern.base":
      "Phone number formatted incorrectly. Correct format is (000) 000-0000",
  }),
})
  .min(1)
  .message({
    "object.min": "Body must have at least one field",
  });
