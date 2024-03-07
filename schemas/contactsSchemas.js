import Joi from "joi";
import { phonePattern } from "../constants/contacts-constants.js";

export const createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string()
    .email()
    .message({ "string.email": "Wrong email format" })
    .required(),
  phone: Joi.string()
    .pattern(phonePattern)
    .messages({
      "string.pattern.base":
        "Phone number formatted incorrectly. Correct format is (000) 000-0000",
    })
    .required(),
  favorite: Joi.boolean(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email().message({ "string.email": "Wrong email format" }),
  phone: Joi.string().pattern(phonePattern).messages({
    "string.pattern.base":
      "Phone number formatted incorrectly. Correct format is (000) 000-0000",
  }),
  favorite: Joi.boolean(),
})
  .min(1)
  .message({
    "object.min": "Body must have at least one field",
  });

export const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});
