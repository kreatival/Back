const Joi = require('joi');

// Definir el esquema de validación para el usuario
const userSchema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    birth_date: Joi.date().iso().allow(null, '').optional(),
    dni: Joi.string().optional(),
    email: Joi.string().email().required(),
    phone_number: Joi.string().required(),
    password: Joi.string().min(8).required(),
    role_id: Joi.number().integer().required(),
    active: Joi.required(),
    clinic_id: Joi.number().integer().required(),
    image: Joi.string().allow(null, '').optional(),
  });
  
  // Definir el esquema de validación para el usuario
  const userPatchSchema = Joi.object({
    first_name: Joi.string().allow(null, '').optional(),
    last_name: Joi.string().allow(null, '').optional(),
    birth_date: Joi.date().iso().allow(null, '').optional(),
    dni: Joi.string().allow(null, '').optional(),
    email: Joi.string().email().allow(null, '').optional(),
    phone_number: Joi.string().allow(null, '').optional(),
    password: Joi.string().allow(null, '').min(8).optional(),
    role_id: Joi.number().integer().allow(null, '').optional(),
    active: Joi.boolean().allow(null, '').optional(),
    clinic_id: Joi.number().integer().allow(null, '').optional(),
    image: Joi.string().allow(null, '').optional(),
  });
  

module.exports = {
    userSchema,
    userPatchSchema
};
