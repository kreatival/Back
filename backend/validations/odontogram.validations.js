const Joi = require('joi');

const odontogramSchema = Joi.object({
  appointment_id: Joi.number().integer().required(),
  patient_id: Joi.number().integer().required(),
  date: Joi.date().iso().required(), // Acepta formatos ISO para la fecha
  type: Joi.string().valid('adult', 'child').required(), // Ajusta según los tipos permitidos
  notes: Joi.string().max(1000).allow(''), // Nota opcional
});

module.exports = {
  odontogramSchema,
};
