const Joi = require('joi');

// Esquema para login
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
});

// Esquema para forgotPassword
const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});

// Esquema para login
const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

// Esquema para changePassword
const changePasswordSchema = Joi.object({
  old_password: Joi.string().min(8).required(),
  new_password: Joi.string().min(8).required(),
  confirm_password: Joi.string().valid(Joi.ref('new_password')).required()
});

module.exports = {
  loginSchema,
  forgotPasswordSchema,  
  changePasswordSchema,
  resetPasswordSchema
};
