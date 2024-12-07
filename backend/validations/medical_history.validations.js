const Joi = require('joi');

const medicalHistorySchema = Joi.object({
  patient_id: Joi.number().integer().required(),
  cardiac_issues: Joi.boolean().required(),
  diabetes: Joi.boolean().required(),
  hepatitis: Joi.boolean().required(),
  drug_consumption: Joi.boolean().required(),
  abnormal_blood_pressure: Joi.boolean().required(),
  hiv: Joi.boolean().required(),
  asthma: Joi.boolean().required(),
  anemia: Joi.boolean().required(),
  epilepsy: Joi.boolean().required(),
  pregnancy: Joi.boolean().required(),
  medication_consumption: Joi.boolean().required(),
  medications_notes: Joi.string().allow(''),
  allergies: Joi.boolean().required(),
  allergies_notes: Joi.string().allow(''),
  notes: Joi.string().allow(''),
});

module.exports = {
  medicalHistorySchema,
};
