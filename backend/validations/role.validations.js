const Joi = require('joi');

// Esquema de validación para roles
const roleSchema = Joi.object({
  name: Joi.string().min(1).max(55).required(), // Nombre del rol, requerido y con longitud máxima de 255 caracteres
});

module.exports = roleSchema;
