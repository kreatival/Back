const Joi = require('joi');

const toothSchema = Joi.object({
  odontogram_id: Joi.number().integer().required(),
  tooth_number: Joi.number().integer().required(),
  general_condition: Joi.string().allow(''),
  mesial_side: Joi.string().allow(''),
  distal_side: Joi.string().allow(''),
  buccal_side: Joi.string().allow(''),
  lingual_side: Joi.string().allow(''),
  center: Joi.string().allow(''),
});

module.exports = {
  toothSchema,
};
