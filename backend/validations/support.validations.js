const Joi = require('joi');

const supportRequestSchema = Joi.object({
  first_name: Joi.string().min(1).max(55).required(),
  last_name: Joi.string().min(1).max(55).required(),
  phone_number: Joi.string().allow('', null).optional(), 
  email: Joi.string().email().required(),
  issue_detail: Joi.string().min(1).max(1000).allow('', null).optional(), 
  images: Joi.string().allow(null, '').optional(),
});

module.exports = {
  supportRequestSchema,
};
