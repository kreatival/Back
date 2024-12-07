const Joi = require('joi');

const reasonSchema = Joi.object({
  description: Joi.string().min(1).max(55).required(),
  time: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(), // Formato de tiempo "HH:mm"
});

module.exports = reasonSchema;
