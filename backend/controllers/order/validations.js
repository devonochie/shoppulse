
const Joi = require("joi");


const OrderSchema = Joi.object({
   items: Joi.array().items(Joi.string()).required(),
   total: Joi.number().required()
 });

 module.exports = OrderSchema