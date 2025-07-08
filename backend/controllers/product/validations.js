const Joi = require('joi')


const ProductSchema = Joi.object({
   title: Joi.string().required(),
   description: Joi.string().min(3),
   price: Joi.number().required(),
   photo: Joi.string(),
   category:Joi.string()
 });


 module.exports = ProductSchema