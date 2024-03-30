import Joi from "joi";
import { emailRegexp } from "../constants/user-constants.js";

export const userSignUpSchema = Joi.object({
  password: Joi.string()
    .min(6)
    .required()
    .messages({ "any.required": "Password is required" }),
  email: Joi.string()
    .required()
    .pattern(emailRegexp)
    .messages({ "any.required": "Email is required" }),
});

export const userSignInSchema = Joi.object({
  password: Joi.string()
    .min(6)
    .required()
    .messages({ "any.required": "Password is required" }),
  email: Joi.string()
    .required()
    .pattern(emailRegexp)
    .messages({ "any.required": "Email is required" }),
});

export const userEmailSchema = Joi.object({
  email: Joi.string()
    .required()
    .pattern(emailRegexp)
    .messages({ "any.required": "missing required field email" }),
});
