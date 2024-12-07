const Joi = require('joi');

const clinicInfoSchema = Joi.object({
  name: Joi.string().min(1).max(55),
  phone_number: Joi.string(),
  address: Joi.string().min(1).max(55),
  email: Joi.string().email(),
  opening_hours: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/), // Formato HH:mm
  closing_hours: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/), // Formato HH:mm
});

module.exports = clinicInfoSchema;
