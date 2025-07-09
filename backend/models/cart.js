const mongoose = require('mongoose');
const Product = require('./product')
const Schema = mongoose.Schema


const cartSchema = new Schema(
   {
     user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
     items: [
       {
         product_id: { type: Schema.Types.ObjectId, ref: 'product', required: true },
         quantity: { type: Number, required: true, min: 1 },
       },
     ],
     totalPrice: {
       type: Number,
       required: true,
       default: 0,
     },
   },
   { timestamps: true }
 );
 
 // Optimize the `pre` hook to calculate totalPrice
 cartSchema.pre('save', async function (next) {
   try {
     const productIds = this.items.map((item) => item.product_id);
     const products = await Product.find({ _id: { $in: productIds } });
 
     const productMap = products.reduce((map, product) => {
       map[product._id.toString()] = product.price;
       return map;
     }, {});
 
     this.totalPrice = this.items.reduce((total, item) => {
       const productPrice = productMap[item.product_id.toString()] || 0;
       return total + productPrice * item.quantity;
     }, 0);
 
     next();
   } catch (error) {
     console.error('Error calculating total price:', error);
     next(error);
   }
 });

const Cart = mongoose.model('cart', cartSchema)
module.exports = Cart