import * as Joi from "joi";

export const JoiValidationSchema = Joi.object({
  DB_URI: Joi.required(),
  PORT: Joi.number().default(4000),
});
